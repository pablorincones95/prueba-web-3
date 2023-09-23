/** Porcentaje total de ganancia en paquete normal */
export const DEFAULT_MAX_PERCENTAGE_TO_WIN = 216;

/** Porcentaje total de ganancia en paquete extendido */
export const DEFAULT_MAX_PERCENTAGE_TO_WIN_EXTENDED = 300;

/** Número de meses que dura un pauqete */
export const DEFAULT_PACKAGE_MONTH_DURATION = 18;


export function calculatePackage(
    amount = 0,
    opts: any = {}
){
    const {
        MAX_PERCENTAGE_TO_WIN = DEFAULT_MAX_PERCENTAGE_TO_WIN,
        PACKAGE_MONTH_DURATION = DEFAULT_PACKAGE_MONTH_DURATION
    } = opts;

    const amountPackage = Number(amount);
    // console.log('amountPackage', amountPackage);

    const amountRevenue = Number((amountPackage * (MAX_PERCENTAGE_TO_WIN / 100)).toFixed(4));
    // console.log('amountRevenue', amountRevenue);

    const profit = Number((amountRevenue - amountPackage).toFixed(4));
    // console.log('profit', profit);

    const durationDays = PACKAGE_MONTH_DURATION * 30;
    // console.log('durationDays', durationDays);

    const dailyRevenue = Number((profit / durationDays).toFixed(4));
    // console.log('dailyRevenue', dailyRevenue);

    return {
        amount: amountPackage,
        maxPercentageToWin: MAX_PERCENTAGE_TO_WIN,
        revenue: amountRevenue,
        profit: profit,
        durationMonths: PACKAGE_MONTH_DURATION,
        durationDays: durationDays,
        dailyRevenue: dailyRevenue,
    }
}