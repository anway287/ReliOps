import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, Chip, Divider, Text } from 'react-native-paper';
import { useAppSelector } from '../../hooks';
import { selectRequestsByDevice } from '../../store/selectors/deviceSelectors';
import { DeviceStatus, ServiceRequest, ServiceRequestStatus, Priority } from '../../types';

const STATUS_COLOR: Record<DeviceStatus, string> = {
  [DeviceStatus.Online]: '#16A34A',
  [DeviceStatus.Offline]: '#DC2626',
  [DeviceStatus.Warning]: '#D97706',
};

const REQUEST_STATUS_COLOR: Record<ServiceRequestStatus, string> = {
  [ServiceRequestStatus.Open]: '#2563EB',
  [ServiceRequestStatus.InProgress]: '#D97706',
  [ServiceRequestStatus.Completed]: '#16A34A',
  [ServiceRequestStatus.Cancelled]: '#6B7280',
};

const PRIORITY_COLOR: Record<Priority, string> = {
  [Priority.Critical]: '#DC2626',
  [Priority.High]: '#EA580C',
  [Priority.Medium]: '#D97706',
  [Priority.Low]: '#16A34A',
};

function RequestTimelineItem({ request }: { request: ServiceRequest }) {
  const router = useRouter();
  return (
    <Card
      style={styles.timelineCard}
      onPress={() => router.push(`/service-request/${request.id}`)}
    >
      <Card.Content>
        <View style={styles.timelineHeader}>
          <Text variant="titleSmall" style={{ flex: 1, fontWeight: '600' }}>{request.title}</Text>
          <Chip
            compact
            style={{ backgroundColor: REQUEST_STATUS_COLOR[request.status] + '22' }}
            textStyle={{ color: REQUEST_STATUS_COLOR[request.status], fontSize: 11 }}
          >
            {request.status.replace('_', ' ').toUpperCase()}
          </Chip>
        </View>
        <View style={styles.timelineMeta}>
          <Text variant="bodySmall" style={{ color: PRIORITY_COLOR[request.priority], fontWeight: '600' }}>
            {request.priority.toUpperCase()}
          </Text>
          <Text variant="bodySmall" style={styles.metaText}>
            {new Date(request.scheduledDate).toLocaleDateString()}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

export default function DeviceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const device = useAppSelector((s) => s.devices.items.find((d) => d.id === id));
  const requests = useAppSelector(selectRequestsByDevice(id));
  const loading = useAppSelector((s) => s.devices.loading);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.center}>
        <Text>Device not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header Card */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.deviceName}>{device.name}</Text>
          <Text variant="bodyMedium" style={styles.subtext}>{device.type} · {device.location}</Text>
          <View style={styles.statusRow}>
            <Chip
              style={{ backgroundColor: STATUS_COLOR[device.status] + '22' }}
              textStyle={{ color: STATUS_COLOR[device.status], fontWeight: '700' }}
            >
              {device.status.toUpperCase()}
            </Chip>
            <Text variant="bodySmall" style={styles.lastSeen}>
              Last seen: {new Date(device.lastSeen).toLocaleString()}
            </Text>
          </View>
          <Text variant="bodySmall" style={styles.maintenance}>
            {device.lastMaintenanceDate
              ? `Last maintenance: ${new Date(device.lastMaintenanceDate).toLocaleDateString()}`
              : 'No maintenance history'}
          </Text>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        icon="plus"
        style={styles.createButton}
        onPress={() => router.push({ pathname: '/service-request/create', params: { deviceId: id } })}
      >
        Create Service Request
      </Button>

      <Divider style={styles.divider} />
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Maintenance Timeline ({requests.length})
      </Text>

      {requests.length === 0 ? (
        <View style={styles.emptyTimeline}>
          <Text style={styles.emptyText}>No service requests yet.</Text>
        </View>
      ) : (
        requests.map((r) => <RequestTimelineItem key={r.id} request={r} />)
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerCard: { margin: 12, borderRadius: 12 },
  deviceName: { fontWeight: '700', marginBottom: 4 },
  subtext: { color: '#6B7280', marginBottom: 12 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  lastSeen: { color: '#6B7280', flex: 1 },
  maintenance: { color: '#6B7280' },
  createButton: { marginHorizontal: 12, borderRadius: 8, backgroundColor: '#2563EB' },
  divider: { margin: 12 },
  sectionTitle: { fontWeight: '700', marginHorizontal: 12, marginBottom: 8 },
  timelineCard: { marginHorizontal: 12, marginBottom: 8, borderRadius: 10 },
  timelineHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 8 },
  timelineMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  metaText: { color: '#6B7280' },
  emptyTimeline: { alignItems: 'center', paddingVertical: 32 },
  emptyText: { color: '#9CA3AF', fontSize: 14 },
});
