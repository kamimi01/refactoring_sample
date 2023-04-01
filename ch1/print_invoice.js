import * as fs from "fs"

const invoice = JSON.parse(fs.readFileSync("./invoices.json", 'utf-8'))[0]
const plays = JSON.parse(fs.readFileSync("./plays.json", "utf-8"))

/**
 * 劇団員を派遣して、劇のパフォーマンスを行う会社が、演じた劇に対しての請求をする。特典のポイントもある。
 * 計算したいこと
 * - 演じた劇に対しての請求
 * - 特典ポイント
 * 
 * @param invoice 請求書
 * @param plays 演劇の一覧
 * @returns 
 */
export function statement(invoice, plays) {
    /**
     * 演目
     * @param aPerformance パフォーマンス
     * @returns 
     */
    function playFor(aPerformance) {
        return plays[aPerformance.playID]
    }

    /**
     * 演目ごとの料金の計算
     * @param perf パフォーマンス
     * @param play 演目の一覧
     * @returns 
     */
    function amountFor(perf) {
        let thisAmount = 0
        switch (playFor(perf).type) {
            case "tragedy":
                thisAmount = 40000
                // 観客が30人以上だったら、30を超えた人数ごとに $1000 加算する
                if (perf.audience > 30) {
                    thisAmount += 1000 * (perf.audience - 30)
                }
                break
            case "comedy":
                thisAmount = 30000
                // 観客が20人以上だったら、20人を超えた人数ごとに $500 加算する
                if (perf.audience > 20) {
                    thisAmount += 10000 + 500 * (perf.audience - 20)
                }
                // 観客数ごとに $300 を加算する
                thisAmount += 300 + perf.audience
                break
            default:
                throw new Error(`unknown type: ${playFor(perf).type}`)
        }
        return thisAmount
    }

    let totalAmount = 0
    let volumeCredits = 0
    let result = `Statement for ${invoice.customer}（請求）\n`

    const format = new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2
        }
    ).format

    for (let perf of invoice.performances) {
        let thisAmount = amountFor(perf)

        // ボリューム特典のポイントを加算
        volumeCredits += Math.max(perf.audience - 30, 0)
        // 喜劇の時は10人につき、さらにポイントを加算
        if ("comedy" == playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5)
        // 注文の内訳を出力
        result += `  ${playFor(perf).name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`
        totalAmount += thisAmount
    }

    result += `Amount owed（請求額） is ${format(totalAmount / 100)}\n`
    result += `You earned ${volumeCredits} credits（特典クレジット）\n`
    return result
}