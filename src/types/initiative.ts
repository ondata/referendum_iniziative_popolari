export interface Initiative {
  id: number;
  titolo: string;
  descrizioneBreve?: string;
  descrizione?: string;
  dataApertura: string;
  dataChiusura?: string;
  sostenitori?: number;
  sito?: string;
  idDecCatIniziativa: {
    id: number;
    nome: string;
    descrizione?: string;
  };
  idDecStatoIniziativa: {
    id: number;
    nome: string;
    descrizione?: string;
  };
  idDecTipoIniziativa?: {
    id: number;
    nome: string;
    descrizione?: string;
  };
  // Altri campi che potrebbero essere presenti nel JSON
  [key: string]: any;
}

export interface ApiResponse {
  initiatives: Initiative[];
  total: number;
  page: number;
  pageSize: number;
}
