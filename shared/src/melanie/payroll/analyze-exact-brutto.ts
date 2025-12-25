import * as BigJs from "big.js";
const Big = BigJs.Big;

// Analyze what happens at exactly €3,504 brutto
const bruttoCents = 350400;
const bruttoEUR = bruttoCents / 100;

console.log("=== Analysis of €3,504 Brutto ===\n");

// 1. Calculate annual amounts
const annualBruttoEUR = bruttoEUR * 12;
console.log(`Monthly Brutto: €${bruttoEUR.toFixed(2)}`);
console.log(`Annual Brutto: €${annualBruttoEUR.toFixed(2)}`);

// 2. Calculate Vorsorgepauschale
const annualBrutto = new Big(annualBruttoEUR);
const BBGRV = new Big(90600);
const BBGKVPV = new Big(66150);

const rvBase = annualBrutto.lt(BBGRV) ? annualBrutto : BBGRV;
const kvpvBase = annualBrutto.lt(BBGKVPV) ? annualBrutto : BBGKVPV;

const vsp1 = rvBase.times(0.093);
const vsp2 = kvpvBase.times(0.12);
const vspTotal = vsp1.plus(vsp2);
const vspUsed = vspTotal.gt(1900) ? vspTotal : new Big(1900);

console.log(`\nVorsorgepauschale Calculation:`);
console.log(`  RV Base (capped): €${rvBase.toFixed(2)}`);
console.log(`  VSP1 (9.3% of RV base): €${vsp1.toFixed(2)}`);
console.log(`  KV/PV Base (capped): €${kvpvBase.toFixed(2)}`);
console.log(`  VSP2 (12% of KV/PV base): €${vsp2.toFixed(2)}`);
console.log(`  Total VSP: €${vspTotal.toFixed(2)}`);
console.log(`  VSP Used (min €1,900): €${vspUsed.toFixed(2)}`);

// 3. Calculate taxable income
const WERBUNGSKOSTEN = new Big(1230);
const SONDERAUSGABEN = new Big(36);
const zve = annualBrutto.minus(vspUsed).minus(WERBUNGSKOSTEN).minus(SONDERAUSGABEN);

console.log(`\nTaxable Income (ZVE):`);
console.log(`  Brutto: €${annualBrutto.toFixed(2)}`);
console.log(`  - Vorsorgepauschale: €${vspUsed.toFixed(2)}`);
console.log(`  - Werbungskosten: €${WERBUNGSKOSTEN.toFixed(2)}`);
console.log(`  - Sonderausgaben: €${SONDERAUSGABEN.toFixed(2)}`);
console.log(`  = ZVE: €${zve.toFixed(2)}`);

// 4. Calculate income tax
function calcIncomeTax2025(x: BigJs.Big): BigJs.Big {
  const GFB = new Big(12096);
  const ZONE1 = new Big(17444);
  const ZONE2 = new Big(68481);
  const ZAHL10000 = new Big(10000);

  if (x.lte(GFB)) return new Big(0);
  if (x.lte(ZONE1)) {
    const y = x.minus(GFB).div(ZAHL10000);
    return y.times(932.3).plus(1400).times(y);
  }
  if (x.lte(ZONE2)) {
    const z = x.minus(new Big(17443)).div(ZAHL10000);
    return z.times(176.64).plus(2397).times(z).plus(1015.13);
  }
  return x.times(0.42).minus(10911.92);
}

const annualTax = calcIncomeTax2025(zve);
const monthlyTax = annualTax.div(12);

console.log(`\nIncome Tax:`);
console.log(`  Annual Tax: €${annualTax.toFixed(2)}`);
console.log(`  Monthly Tax: €${monthlyTax.toFixed(2)}`);

// 5. Calculate social security (employee share only)
const kvRate = 0.0905;       // 9.05% total employee share
const pvRate = 0.017 + 0.006; // 1.7% base + 0.6% childless
const rvRate = 0.093;         // 9.3% employee share
const avRate = 0.013;         // 1.3% employee share

const kvpvBaseMon = Math.min(bruttoCents, 517500);
const rvavBaseMon = Math.min(bruttoCents, 755000);

const kvAmount = kvpvBaseMon * kvRate;
const pvAmount = kvpvBaseMon * pvRate;
const rvAmount = rvavBaseMon * rvRate;
const avAmount = rvavBaseMon * avRate;
const totalSocialSec = kvAmount + pvAmount + rvAmount + avAmount;

console.log(`\nSocial Security (Employee Share):`);
console.log(`  KV (9.05%): €${(kvAmount/100).toFixed(2)}`);
console.log(`  PV (2.3%): €${(pvAmount/100).toFixed(2)} (includes 0.6% childless)`);
console.log(`  RV (9.3%): €${(rvAmount/100).toFixed(2)}`);
console.log(`  AV (1.3%): €${(avAmount/100).toFixed(2)}`);
console.log(`  Total: €${(totalSocialSec/100).toFixed(2)} (${((totalSocialSec/bruttoCents)*100).toFixed(2)}%)`);

// 6. Calculate resulting netto
const nettoResult = bruttoCents - (monthlyTax.times(100).toNumber()) - totalSocialSec;

console.log(`\n=== Final Result ===`);
console.log(`Brutto: €${bruttoEUR.toFixed(2)}`);
console.log(`- Tax: €${monthlyTax.toFixed(2)}`);
console.log(`- Social Security: €${(totalSocialSec/100).toFixed(2)}`);
console.log(`= Netto: €${(nettoResult/100).toFixed(2)}`);

console.log(`\n${nettoResult/100 >= 2300 ? '✅' : '❌'} Target Netto: €2,300.00`);
console.log(`Difference from target: €${((nettoResult/100) - 2300).toFixed(2)}`);