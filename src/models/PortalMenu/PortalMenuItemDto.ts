export interface PortalMenuItemDto {
    id: number;
    label: string;
    iconName?: string;
    path?: string;
    itemType: string;
    ordering: number;
    columnGroup: number;
    children?: PortalMenuItemDto[];
}
