import { useEffect } from 'react';
import { FlatList, StyleSheet, View, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Searchbar, Card, Text, Badge, Chip, ActivityIndicator } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchDevices, setSearchQuery } from '../../store/slices/devicesSlice';
import { fetchServiceRequests } from '../../store/slices/serviceRequestsSlice';
import { selectFilteredDevices, selectOpenRequestCountByDevice } from '../../store/selectors/deviceSelectors';
import { Device, DeviceStatus } from '../../types';

const STATUS_COLOR: Record<DeviceStatus, string> = {
  [DeviceStatus.Online]: '#16A34A',
  [DeviceStatus.Offline]: '#DC2626',
  [DeviceStatus.Warning]: '#D97706',
};

function DeviceCard({ device, openCount }: { device: Device; openCount: number }) {
  const router = useRouter();
  return (
    <Card style={styles.card} onPress={() => router.push(`/device/${device.id}`)}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text variant="titleMedium" style={styles.deviceName}>{device.name}</Text>
            <Text variant="bodySmall" style={styles.deviceType}>{device.type} · {device.location}</Text>
          </View>
          {openCount > 0 && (
            <Badge style={styles.badge}>{openCount}</Badge>
          )}
        </View>
        <View style={styles.cardFooter}>
          <Chip
            compact
            style={[styles.statusChip, { backgroundColor: STATUS_COLOR[device.status] + '22' }]}
            textStyle={{ color: STATUS_COLOR[device.status], fontSize: 12 }}
          >
            {device.status.toUpperCase()}
          </Chip>
          <Text variant="bodySmall" style={styles.maintenance}>
            {device.lastMaintenanceDate
              ? `Last maintenance: ${new Date(device.lastMaintenanceDate).toLocaleDateString()}`
              : 'No maintenance history'}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

export default function EquipmentListScreen() {
  const dispatch = useAppDispatch();
  const devices = useAppSelector(selectFilteredDevices);
  const openCounts = useAppSelector(selectOpenRequestCountByDevice);
  const { loading, error, searchQuery } = useAppSelector((s) => s.devices);

  useEffect(() => {
    dispatch(fetchDevices());
    dispatch(fetchServiceRequests());
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search equipment..."
        value={searchQuery}
        onChangeText={(q) => dispatch(setSearchQuery(q))}
        style={styles.searchbar}
      />
      <FlatList
        data={devices}
        keyExtractor={(d) => d.id}
        renderItem={({ item }) => (
          <DeviceCard device={item} openCount={openCounts[item.id] ?? 0} />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              dispatch(fetchDevices());
              dispatch(fetchServiceRequests());
            }}
          />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.empty}>No equipment found.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  searchbar: { margin: 12, elevation: 2 },
  list: { paddingHorizontal: 12, paddingBottom: 24 },
  card: { marginBottom: 10, borderRadius: 10 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  deviceName: { fontWeight: '700' },
  deviceType: { color: '#6B7280', marginTop: 2 },
  badge: { backgroundColor: '#2563EB', color: 'white', alignSelf: 'flex-start' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusChip: { height: 26 },
  maintenance: { color: '#6B7280', fontSize: 11, flexShrink: 1, marginLeft: 8, textAlign: 'right' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  error: { color: '#DC2626', fontSize: 15 },
  empty: { color: '#6B7280', fontSize: 15 },
});
