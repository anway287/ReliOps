import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  Button,
  Card,
  Chip,
  Divider,
  Menu,
  Text,
  TextInput,
} from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectRequestById } from '../../store/selectors/serviceRequestSelectors';
import { updateStatus, addNote } from '../../store/slices/serviceRequestsSlice';
import {
  ActivityLogEntry,
  Category,
  Priority,
  ServiceRequestStatus,
} from '../../types';

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

const CATEGORY_LABEL: Record<Category, string> = {
  [Category.Repair]: 'Repair',
  [Category.PreventiveMaintenance]: 'Preventive Maintenance',
  [Category.Inspection]: 'Inspection',
  [Category.Replacement]: 'Replacement',
};

const NEXT_STATUSES: Partial<Record<ServiceRequestStatus, { status: ServiceRequestStatus; label: string }[]>> = {
  [ServiceRequestStatus.Open]: [
    { status: ServiceRequestStatus.InProgress, label: 'Mark In Progress' },
    { status: ServiceRequestStatus.Cancelled, label: 'Cancel Request' },
  ],
  [ServiceRequestStatus.InProgress]: [
    { status: ServiceRequestStatus.Completed, label: 'Mark Completed' },
    { status: ServiceRequestStatus.Cancelled, label: 'Cancel Request' },
  ],
};

function LogItem({ entry }: { entry: ActivityLogEntry }) {
  return (
    <View style={styles.logItem}>
      <View style={[styles.logDot, { backgroundColor: entry.type === 'note' ? '#7C3AED' : '#2563EB' }]} />
      <View style={{ flex: 1 }}>
        <Text variant="bodySmall" style={styles.logMessage}>{entry.message}</Text>
        <Text variant="bodySmall" style={styles.logTime}>
          {new Date(entry.timestamp).toLocaleString()}
        </Text>
      </View>
    </View>
  );
}

export default function ServiceRequestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const request = useAppSelector(selectRequestById(id));
  const [menuVisible, setMenuVisible] = useState(false);
  const [note, setNote] = useState('');

  if (!request) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const nextStatuses = NEXT_STATUSES[request.status] ?? [];
  const sortedLog = [...request.activityLog].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  function handleStatusChange(status: ServiceRequestStatus, label: string) {
    dispatch(updateStatus({ id, status, logMessage: `Status changed to ${label}.` }));
    setMenuVisible(false);
  }

  function handleAddNote() {
    if (!note.trim()) return;
    dispatch(addNote({ id, note: note.trim() }));
    setNote('');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Info Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>{request.title}</Text>
          <Text variant="bodyMedium" style={styles.description}>{request.description}</Text>
          <Divider style={{ marginVertical: 12 }} />
          <View style={styles.metaRow}>
            <Chip
              style={{ backgroundColor: STATUS_COLOR[request.status] + '22' }}
              textStyle={{ color: STATUS_COLOR[request.status], fontWeight: '700' }}
            >
              {request.status.replace('_', ' ').toUpperCase()}
            </Chip>
            <Chip
              style={{ backgroundColor: PRIORITY_COLOR[request.priority] + '22' }}
              textStyle={{ color: PRIORITY_COLOR[request.priority], fontWeight: '700' }}
            >
              {request.priority.toUpperCase()}
            </Chip>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text variant="labelSmall" style={styles.infoLabel}>CATEGORY</Text>
              <Text variant="bodySmall">{CATEGORY_LABEL[request.category]}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text variant="labelSmall" style={styles.infoLabel}>SCHEDULED</Text>
              <Text variant="bodySmall">{new Date(request.scheduledDate).toLocaleDateString()}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text variant="labelSmall" style={styles.infoLabel}>CREATED</Text>
              <Text variant="bodySmall">{new Date(request.createdAt).toLocaleDateString()}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Status Action */}
      {nextStatuses.length > 0 && (
        <View style={styles.actionRow}>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                mode="contained"
                onPress={() => setMenuVisible(true)}
                style={styles.actionButton}
                icon="chevron-down"
              >
                Update Status
              </Button>
            }
          >
            {nextStatuses.map((ns) => (
              <Menu.Item
                key={ns.status}
                onPress={() => handleStatusChange(ns.status, ns.label)}
                title={ns.label}
              />
            ))}
          </Menu>
        </View>
      )}

      {/* Add Note */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>Add Note</Text>
          <TextInput
            mode="outlined"
            placeholder="Type a note..."
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
            style={styles.noteInput}
          />
          <Button
            mode="outlined"
            onPress={handleAddNote}
            disabled={!note.trim()}
            style={{ marginTop: 8 }}
          >
            Add Note
          </Button>
        </Card.Content>
      </Card>

      {/* Activity Log */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>Activity Log</Text>
          {sortedLog.map((entry) => (
            <LogItem key={entry.id} entry={entry} />
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { margin: 12, marginBottom: 4, borderRadius: 12 },
  title: { fontWeight: '700', marginBottom: 8 },
  description: { color: '#374151', lineHeight: 22 },
  metaRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  infoItem: { minWidth: '30%' },
  infoLabel: { color: '#9CA3AF', marginBottom: 2 },
  actionRow: { marginHorizontal: 12, marginVertical: 8 },
  actionButton: { borderRadius: 8, backgroundColor: '#2563EB' },
  sectionTitle: { fontWeight: '700', marginBottom: 12 },
  noteInput: { backgroundColor: 'white' },
  logItem: { flexDirection: 'row', gap: 12, marginBottom: 14, alignItems: 'flex-start' },
  logDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  logMessage: { color: '#374151', marginBottom: 2 },
  logTime: { color: '#9CA3AF' },
});
