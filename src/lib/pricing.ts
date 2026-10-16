export type SnackQty={popcorn:number;gaseosa:number;combo:number};
export function calculateTotal(ticketQty:number,snacks:SnackQty){if(!Number.isInteger(ticketQty)||ticketQty<1||ticketQty>6)throw new Error('Cantidad de entradas inválida');for(const value of Object.values(snacks))if(!Number.isInteger(value)||value<0||value>20)throw new Error('Cantidad de snack inválida');return ticketQty*3+snacks.popcorn*3+snacks.gaseosa*3+snacks.combo*5}
export function inventoryUse(snacks:SnackQty){return{popcorn:snacks.popcorn+snacks.combo,gaseosa:snacks.gaseosa+snacks.combo}}
