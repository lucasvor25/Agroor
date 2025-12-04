export type Ocorrencia = {
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