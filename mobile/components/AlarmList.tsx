import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useState } from "react";

type Alarm = {
    id: string;
    pair: string;
    target: number;
    direction?: "buy" | "sell";
    active: boolean;
}

type AlarmListProps = {
    alarms: Alarm[];
    onDelete: (id: string) => void;
    onEdit: (id: string, newTarget: number) => void;
};

export default function AlarmList ({ alarms, onDelete, onEdit }: AlarmListProps){
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editedTarget, setEditedTarget] = useState("");

    if (alarms.length === 0){
        return(
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No alarms yet.</Text>
                <Text style={styles.emptyText}>
                    Select your forex pair and create your first price alarm.
                </Text>
            </View>
        );
    }

    return(
        <View style={styles.container}>
            {alarms.map((alarm) => (
                <View key={alarm.id} style={styles.alarmCard}>
                    <View>
                        <Text style={styles.pair}>{alarm.pair}</Text>
                        <Text style={styles.target}>
                            Direction: {(alarm.direction ?? "buy").toUpperCase()}
                        </Text>
                        {editingId === alarm.id ? (
                            <TextInput
                                style={styles.targetInput}
                                value={editedTarget}
                                onChangeText={setEditedTarget}
                                keyboardType="decimal-pad"
                                placeholder="Enter target price."
                            />
                        ) : (
                            <Text style={styles.target}>
                                Target Price:{alarm.target}
                            </Text>
                        )}
                    </View>
                    
                    <View style={styles.actions}>
                        <Text 
                            style={[
                                styles.status,
                                alarm.active ? styles.active : styles.triggered,
                            ]}
                        >
                            {alarm.active ? "Active" : "Triggered"}
                        </Text>

                        {editingId === alarm.id ? (
                            <Text 
                                onPress={() => {
                                    const newTarget = Number(editedTarget);

                                    if(editedTarget.trim() !== "" && Number.isFinite(newTarget) && newTarget > 0) {
                                        onEdit(alarm.id, newTarget);
                                        setEditingId(null);
                                        setEditedTarget("");
                                    }
                                }}
                                style={styles.editButton}
                            >
                                Save
                            </Text>

                        ) : (
                            <Text 
                                onPress={() => {
                                    setEditingId(alarm.id);
                                    setEditedTarget(String(alarm.target));
                                }}
                                style={styles.editButton}
                            >
                                Edit
                            </Text>
                        )}

                        <Text 
                            onPress={() => onDelete(alarm.id)}
                            style={styles.deleteButton}
                        >
                            Delete
                        </Text>
                    </View>
                </View>
            ))}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 12,
    },
    emptyContainer: {
        padding: 24,
        alignItems: "center",
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1f2937",
    },
    emptyText: {
        marginTop: 8,
        color: "#6b7280",
        textAlign: "center",
    },
    alarmCard: {
        backgroundColor: "#ffffff",
        padding: 16,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    pair: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#111827",
    },
    target: {
        marginTop: 6,
        color: "#4b5563",
    },
    status: {
        fontWeight: "bold",
        fontSize: 12,
    },
    active: {
        color: "#15803d",
    },
    triggered: {
        color: "#dc2626",
    },
    actions: {
        alignItems: "flex-end",
        gap: 8,
    },
    deleteButton: {
        color: "#dc2626",
        fontWeight: "bold",
        fontSize: 14,
        paddingVertical: 4, 
    },
    editButton: {
        color: "#2563eb",
        fontWeight: "bold",
        fontSize: 14,
        paddingVertical: 4,
    },
    targetInput: {
        borderWidth: 1,
        borderColor: "#2563eb",
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 6,
        minWidth: 120,
        marginTop: 6,
    },
});

