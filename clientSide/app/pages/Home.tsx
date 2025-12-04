import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Sprout, Calendar, FileText, TrendingUp } from "lucide-react-native";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { router } from "expo-router";
import { mockService } from "../../services/mockedOccurrences";
// import { useAuth } from "../../context/AuthContext";
// Para MapView: Descomente após configurar Google/Apple Maps e executar EAS Build
// import MapView, { Marker } from "react-native-maps";
type Ocorrencia = {
    id: string;
    tipo: string;
    produtor: string;
    talhao: string;
    safra: string;
    data: string;
    orientacoes: string | null;
    latitude: number | null;
    longitude: number | null;
};

export default function Home() {
    // const { user, loading } = useAuth();
    const [stats, setStats] = useState({
        total: 0,
        ultimos7Dias: 0,
        esteMes: 0,
        pragas: 0,
    });

    const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
    const [filteredOcorrencias, setFilteredOcorrencias] = useState<Ocorrencia[]>([]);
    const [tipoFiltro, setTipoFiltro] = useState("todos");

    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [isLoadingOcorrencias, setIsLoadingOcorrencias] = useState(true);

    // useEffect(() => {
    //     if (!loading && !user) {
    //         router.push("/auth");
    //     }
    // }, [loading, user]);

    useEffect(() => {
        // Carregar dados na montagem
        fetchStats();
        fetchOcorrencias();
    }, []);

    // useEffect(() => {
    //     if (user) {
    //         fetchStats();
    //         fetchOcorrencias();
    //     }
    // }, [user]);

    useEffect(() => {
        if (tipoFiltro === "todos") {
            setFilteredOcorrencias(ocorrencias);
        } else {
            setFilteredOcorrencias(ocorrencias.filter(o => o.tipo === tipoFiltro));
        }
    }, [tipoFiltro, ocorrencias]);

    const fetchStats = async () => {
        setIsLoadingStats(true);
        const statsMock = await mockService.getStats();
        setStats({
            total: statsMock.total,
            ultimos7Dias: statsMock.ultimos7Dias,
            esteMes: statsMock.esteMes,
            pragas: statsMock.pragas,
        });
        setIsLoadingStats(false);
    };

    const fetchOcorrencias = async () => {
        setIsLoadingOcorrencias(true);
        const response = await mockService.getOcorrencias(20);
        setOcorrencias(response);
        setIsLoadingOcorrencias(false);
    };

    const getTipoBadgeColor = (tipo: string) => {
        const colors: Record<string, string> = {
            irrigacao: "#93c5fd",
            pulverizacao: "#d8b4fe",
            colheita: "#fde68a",
            plantio: "#86efac",
            pragas: "#fca5a5",
            adubacao: "#6ee7b7",
            manutencao: "#e5e7eb",
        };
        return colors[tipo] || "#e5e7eb";
    };

    // if (loading) {
    //     return (
    //         <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    //             <Text>Carregando...</Text>
    //         </View>
    //     );
    // }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 80 }}>
                {/* Header */}
                <View style={styles.header}>
                    <Sprout size={24} color="white" />
                    <View>
                        <Text style={styles.headerTitle}>AgroGestão</Text>
                        {/* <Text style={styles.headerEmail}>{user?.email}</Text> */}
                    </View>
                </View>

                {/* MAPA */}
                {/* <View style={styles.mapContainer}>
                    <MapView
                        style={{ flex: 1 }}
                        initialRegion={{
                            latitude: -15.78,
                            longitude: -47.93,
                            latitudeDelta: 0.5,
                            longitudeDelta: 0.5,
                        }}
                    />
                </View> */}

                {/* STATS GRID */}
                <View style={styles.statsGrid}>
                    {/* TOTAL */}
                    <View style={[styles.statCard, { backgroundColor: "#d1fae5" }]}>
                        <View style={styles.statCardTitleRow}>
                            <FileText size={16} color="#2f8f2f" />
                            <Text style={styles.statCardTitle}>Total</Text>
                        </View>
                        {isLoadingStats ? (
                            <ActivityIndicator size="small" color="#166534" />
                        ) : (
                            <Text style={[styles.statCardValue, { color: "#166534" }]}>{stats.total}</Text>
                        )}
                    </View>

                    {/* 7 DIAS */}
                    <View style={[styles.statCard, { backgroundColor: "#dbeafe" }]}>
                        <View style={styles.statCardTitleRow}>
                            <Calendar size={16} color="#2667a8" />
                            <Text style={styles.statCardTitle}>7 dias</Text>
                        </View>
                        {isLoadingStats ? (
                            <ActivityIndicator size="small" color="#1e40af" />
                        ) : (
                            <Text style={[styles.statCardValue, { color: "#1e40af" }]}>{stats.ultimos7Dias}</Text>
                        )}
                    </View>

                    {/* ESTE MES */}
                    <View style={[styles.statCard, { backgroundColor: "#fef3c7" }]}>
                        <View style={styles.statCardTitleRow}>
                            <TrendingUp size={16} color="#b68b00" />
                            <Text style={styles.statCardTitle}>Mês</Text>
                        </View>
                        {isLoadingStats ? (
                            <ActivityIndicator size="small" color="#b68b00" />
                        ) : (
                            <Text style={[styles.statCardValue, { color: "#b68b00" }]}>{stats.esteMes}</Text>
                        )}
                    </View>

                    {/* PRAGAS */}
                    <View style={[styles.statCard, { backgroundColor: "#fee2e2" }]}>
                        <View style={styles.statCardTitleRow}>
                            <Sprout size={16} color="#b02020" />
                            <Text style={styles.statCardTitle}>Pragas</Text>
                        </View>
                        {isLoadingStats ? (
                            <ActivityIndicator size="small" color="#b02020" />
                        ) : (
                            <Text style={[styles.statCardValue, { color: "#b02020" }]}>{stats.pragas}</Text>
                        )}
                    </View>
                </View>

                {/* LISTA */}
                <View style={{ marginTop: 16 }}>
                    <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>Ocorrências Recentes</Text>

                    {isLoadingOcorrencias ? (
                        <View style={{ alignItems: "center", paddingVertical: 32 }}>
                            <ActivityIndicator size="large" color="#166534" />
                            <Text style={{ marginTop: 12, color: "#777" }}>Carregando ocorrências...</Text>
                        </View>
                    ) : filteredOcorrencias.length === 0 ? (
                        <Text style={{ textAlign: "center", color: "#777", marginTop: 16 }}>Nenhuma ocorrência</Text>
                    ) : (
                        filteredOcorrencias.slice(0, 10).map((o) => (
                            <View key={o.id} style={styles.cardOcorrencia}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <View>
                                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                            <Text style={[styles.badge, { backgroundColor: getTipoBadgeColor(o.tipo) }]}>
                                                {o.tipo}
                                            </Text>
                                            <Text style={styles.dateText}>
                                                {format(new Date(o.data), "dd/MM/yy", { locale: ptBR })}
                                            </Text>
                                        </View>
                                        <Text style={styles.produtor}>{o.produtor}</Text>
                                        <Text style={styles.talhao}>{o.talhao} • {o.safra}</Text>
                                    </View>
                                </View>
                                {o.orientacoes && <Text style={styles.orientacoes}>{o.orientacoes}</Text>}
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    scroll: { padding: 16, paddingBottom: 80 },
    header: {
        backgroundColor: "#166534",
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    headerTitle: { color: "white", fontWeight: "bold", fontSize: 18 },
    headerEmail: { color: "rgba(255,255,255,0.8)", fontSize: 12 },
    mapContainer: { height: 180, borderRadius: 12, overflow: "hidden", marginBottom: 16 },
    statsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 12 },
    statCard: { width: "48%", padding: 16, borderRadius: 12 },
    statCardTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    statCardTitle: { fontSize: 12, color: "#555" },
    statCardValue: { fontSize: 26, fontWeight: "bold" },
    cardOcorrencia: { backgroundColor: "#eee", padding: 16, borderRadius: 12, marginBottom: 12 },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, fontSize: 12 },
    dateText: { fontSize: 12, color: "#777" },
    produtor: { fontWeight: "600", fontSize: 15 },
    talhao: { fontSize: 12, color: "#777" },
    orientacoes: { marginTop: 6, fontSize: 12, color: "#666" },
});
