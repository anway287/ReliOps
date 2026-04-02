import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Button,
  HelperText,
  SegmentedButtons,
  Text,
  TextInput,
} from 'react-native-paper';
import { useAppDispatch } from '../../hooks';
import { createServiceRequest } from '../../store/slices/serviceRequestsSlice';
import { Category, Priority, ServiceRequestStatus } from '../../types';

interface FormState {
  title: string;
  description: string;
  priority: Priority;
  category: Category;
  scheduledDate: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  scheduledDate?: string;
}

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: Priority.Critical, label: 'Critical' },
  { value: Priority.High, label: 'High' },
  { value: Priority.Medium, label: 'Medium' },
  { value: Priority.Low, label: 'Low' },
];

const CATEGORIES: { value: Category; label: string }[] = [
  { value: Category.Repair, label: 'Repair' },
  { value: Category.PreventiveMaintenance, label: 'Preventive' },
  { value: Category.Inspection, label: 'Inspection' },
  { value: Category.Replacement, label: 'Replacement' },
];

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.title.trim()) errors.title = 'Title is required.';
  if (!form.description.trim()) errors.description = 'Description is required.';
  if (!form.scheduledDate.trim()) {
    errors.scheduledDate = 'Scheduled date is required.';
  } else if (isNaN(Date.parse(form.scheduledDate))) {
    errors.scheduledDate = 'Enter a valid date (YYYY-MM-DD).';
  }
  return errors;
}

export default function CreateServiceRequestScreen() {
  const { deviceId } = useLocalSearchParams<{ deviceId: string }>();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<FormState>({
    title: '',
    description: '',
    priority: Priority.Medium,
    category: Category.Repair,
    scheduledDate: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  async function handleSubmit() {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    const now = new Date().toISOString();
    await dispatch(
      createServiceRequest({
        id: `sr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        deviceId,
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        category: form.category,
        status: ServiceRequestStatus.Open,
        scheduledDate: new Date(form.scheduledDate).toISOString(),
        createdAt: now,
        updatedAt: now,
        activityLog: [
          {
            id: `al_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            timestamp: now,
            message: 'Service request created.',
            type: 'status_change',
          },
        ],
      })
    );
    setSubmitting(false);
    router.back();
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text variant="labelLarge" style={styles.label}>Priority</Text>
      <SegmentedButtons
        value={form.priority}
        onValueChange={(v) => updateField('priority', v as Priority)}
        buttons={PRIORITIES.map((p) => ({ value: p.value, label: p.label }))}
        style={styles.segmented}
      />

      <Text variant="labelLarge" style={styles.label}>Category</Text>
      <SegmentedButtons
        value={form.category}
        onValueChange={(v) => updateField('category', v as Category)}
        buttons={CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
        style={styles.segmented}
      />

      <Text variant="labelLarge" style={styles.label}>Title *</Text>
      <TextInput
        mode="outlined"
        placeholder="Short description of the issue"
        value={form.title}
        onChangeText={(v) => updateField('title', v)}
        error={!!errors.title}
        style={styles.input}
      />
      <HelperText type="error" visible={!!errors.title}>{errors.title}</HelperText>

      <Text variant="labelLarge" style={styles.label}>Description *</Text>
      <TextInput
        mode="outlined"
        placeholder="Detailed description of the issue"
        value={form.description}
        onChangeText={(v) => updateField('description', v)}
        multiline
        numberOfLines={4}
        error={!!errors.description}
        style={styles.input}
      />
      <HelperText type="error" visible={!!errors.description}>{errors.description}</HelperText>

      <Text variant="labelLarge" style={styles.label}>Preferred Schedule * (YYYY-MM-DD)</Text>
      <TextInput
        mode="outlined"
        placeholder="e.g. 2026-04-15"
        value={form.scheduledDate}
        onChangeText={(v) => updateField('scheduledDate', v)}
        error={!!errors.scheduledDate}
        style={styles.input}
      />
      <HelperText type="error" visible={!!errors.scheduledDate}>{errors.scheduledDate}</HelperText>

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={submitting}
        disabled={submitting}
        style={styles.submitButton}
        contentStyle={{ paddingVertical: 6 }}
      >
        Submit Request
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 16 },
  label: { marginTop: 12, marginBottom: 4, color: '#374151', fontWeight: '600' },
  segmented: { marginBottom: 4 },
  input: { backgroundColor: 'white' },
  submitButton: { marginTop: 24, borderRadius: 8, backgroundColor: '#2563EB' },
});
