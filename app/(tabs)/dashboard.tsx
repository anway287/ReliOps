import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, Chip, Text } from 'react-native-paper';
import { useAppSelector } from '../../hooks';
import {
  selectCountsByStatus,
  selectCountsByPriority,
  selectOverdueRequests,
} from '../../store/selectors/serviceRequestSelectors';
import { Priority, ServiceRequest, ServiceRequestStatus } from '../../types';

const STATUS_COLOR: Record<ServiceRequestStatus, string> = {
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

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text variant="headlineMedium" style={[styles.statValue, { color }]}>{value}</Text>
      <Text variant="bodySmall" style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function OverdueCard({ request }: { request: ServiceRequest }) {
  const router = useRouter();
  const device = useAppSelector((s) => s.devices.items.find((d) => d.id === request.deviceId));
  return (
    <Card style={styles.overdueCard} onPress={() => router.push(`/service-request/${request.id}`)}>
      <Card.Content>
        <View style={styles.overdueHeader}>
          <Text variant="titleSmall" style={{ flex: 1, fontWeight: '600' }}>{request.title}</Text>
          <Chip
            compact
            style={{ backgroundColor: PRIORITY_COLOR[request.priority] + '22' }}
            textStyle={{ color: PRIORITY_COLOR[request.priority], fontSize: 11 }}
          >
            {request.priority.toUpperCase()}
          </Chip>
        </View>
        <Text variant="bodySmall" style={styles.overdueDevice}>
          {device ? `${device.name} · ${device.type}` : 'Unknown device'}
        </Text>
        <Text variant="bodySmall" style={styles.overdueDate}>
          Was due: {new Date(request.scheduledDate).toLocaleDateString()}
        </Text>
      </Card.Content>
    </Card>
  );
}

export default function DashboardScreen() {
  const statusCounts = useAppSelector(selectCountsByStatus);
  const priorityCounts = useAppSelector(selectCountsByPriority);
  const overdueRequests = useAppSelector(selectOverdueRequests);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Status Summary */}
      <Text variant="titleMedium" style={styles.sectionTitle}>By Status</Text>
      <View style={styles.statsGrid}>
        <StatCard label="Open" value={statusCounts[ServiceRequestStatus.Open]} color={STATUS_COLOR[ServiceRequestStatus.Open]} />
        <StatCard label="In Progress" value={statusCounts[ServiceRequestStatus.InProgress]} color={STATUS_COLOR[ServiceRequestStatus.InProgress]} />
        <StatCard label="Completed" value={statusCounts[ServiceRequestStatus.Completed]} color={STATUS_COLOR[ServiceRequestStatus.Completed]} />
        <StatCard label="Cancelled" value={statusCounts[ServiceRequestStatus.Cancelled]} color={STATUS_COLOR[ServiceRequestStatus.Cancelled]} />
      </View>

      {/* Priority Summary */}
      <Text variant="titleMedium" style={styles.sectionTitle}>By Priority</Text>
      <View style={styles.statsGrid}>
        <StatCard label="Critical" value={priorityCounts[Priority.Critical]} color={PRIORITY_COLOR[Priority.Critical]} />
        <StatCard label="High" value={priorityCounts[Priority.High]} color={PRIORITY_COLOR[Priority.High]} />
        <StatCard label="Medium" value={priorityCounts[Priority.Medium]} color={PRIORITY_COLOR[Priority.Medium]} />
        <StatCard label="Low" value={priorityCounts[Priority.Low]} color={PRIORITY_COLOR[Priority.Low]} />
      </View>

      {/* Overdue */}
      <View style={styles.overdueHeader2}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Overdue Requests
        </Text>
        {overdueRequests.length > 0 && (
          <View style={styles.overdueBadge}>
            <Text style={styles.overdueBadgeText}>{overdueRequests.length}</Text>
          </View>
        )}
      </View>

      {overdueRequests.length === 0 ? (
        <View style={styles.emptyOverdue}>
          <Text style={styles.emptyText}>No overdue requests.</Text>
        </View>
      ) : (
        overdueRequests.map((r) => <OverdueCard key={r.id} request={r} />)
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  sectionTitle: { fontWeight: '700', marginHorizontal: 12, marginTop: 20, marginBottom: 10 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8 },
  statCard: {
    width: '46%',
    margin: '2%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    borderLeftWidth: 4,
    elevation: 1,
  },
  statValue: { fontWeight: '800', marginBottom: 4 },
  statLabel: { color: '#6B7280' },
  overdueCard: { marginHorizontal: 12, marginBottom: 8, borderRadius: 10 },
  overdueHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 8 },
  overdueDevice: { color: '#6B7280', marginBottom: 2 },
  overdueDate: { color: '#DC2626', fontSize: 12 },
  overdueHeader2: { flexDirection: 'row', alignItems: 'center' },
  overdueBadge: {
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
    marginTop: 20,
  },
  overdueBadgeText: { color: 'white', fontSize: 12, fontWeight: '700' },
  emptyOverdue: { alignItems: 'center', paddingVertical: 24 },
  emptyText: { color: '#9CA3AF', fontSize: 14 },
});
