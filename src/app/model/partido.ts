export interface IPartido {
    id: number;
    rival: string;
    liga: ILiga;
    local: boolean;
    resultado: string;
}

export interface ILiga{
    id: number;
    nombre: string;
    id_equipo?: number;
}