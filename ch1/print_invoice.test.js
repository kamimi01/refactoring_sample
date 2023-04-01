import * as print from "./print_invoice"
import * as fs from "fs"

test("statement 関数の正常系テスト", () => {
    const invoice = JSON.parse(fs.readFileSync("./invoices.json", 'utf-8'))[0]
    const plays = JSON.parse(fs.readFileSync("./plays.json", "utf-8"))

    const actual = print.statement(invoice, plays)
    const expected = 'Statement for BigCo（請求）\n\  Hamlet: $650.00 (55 seats)\n  As You Like It: $478.35 (35 seats)\n  Othello: $500.00 (40 seats)\nAmount owed（請求額） is $1,628.35\nYou earned 47 credits（特典クレジット）\n';

    expect(actual).toBe(expected)
});