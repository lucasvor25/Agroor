// services/mockOcorrencias.ts

import { Ocorrencia } from "../types/Occurrences";

const MOCK_OCORRENCIAS: Ocorrencia[] = [
    {
        id: "1",
        tipo: "irrigacao",
        produtor: "Fazenda Santa Cruz",
        talhao: "Talhão 12",
        safra: "2024/2025",
        data: "2025-01-10",
        orientacoes: "Manter relatório atualizado",
        latitude: -15.78,
        longitude: -47.93,
    },
    {
        id: "2",
        tipo: "pragas",
        produtor: "Sítio Esperança",
        talhao: "Área 3",
        safra: "2024/2025",
        data: "2025-01-08",
        orientacoes: null,
        latitude: -15.82,
        longitude: -47.91,
    },
    {
        id: "3",
        tipo: "pulverizacao",
        produtor: "Fazenda Boa Vista",
        talhao: "Setor Norte",
        safra: "2024/2025",
        data: "2025-01-04",
        orientacoes: "Aplicar 20ml/ha",
        latitude: -15.75,
        longitude: -47.96,
    },
];

export const mockService = {
    async getOcorrencias(limit = 20): Promise<Ocorrencia[]> {
        await new Promise((r) => setTimeout(r, 800)); // Simula atraso

        return MOCK_OCORRENCIAS.slice(0, limit);
    },

    async getStats() {
        await new Promise((r) => setTimeout(r, 600)); // Simula atraso

        const total = MOCK_OCORRENCIAS.length;

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const ultimos7Dias = MOCK_OCORRENCIAS.filter(
            (o) => new Date(o.data) >= sevenDaysAgo
        ).length;

        const firstDayOfMonth = new Date();
        firstDayOfMonth.setDate(1);

        const esteMes = MOCK_OCORRENCIAS.filter(
            (o) => new Date(o.data) >= firstDayOfMonth
        ).length;

        const pragas = MOCK_OCORRENCIAS.filter((o) => o.tipo === "pragas").length;

        return { total, ultimos7Dias, esteMes, pragas };
    },
};
