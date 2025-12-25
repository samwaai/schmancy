# German Payroll Code Verification Report: BMF PAP 2025 & BMAS 2025

Your payroll calculation parameters are **overwhelmingly correct**, with only three minor off-by-one discrepancies in the income tax zone boundaries. All social security parameters verified as accurate. This report documents each verification against official German government sources published through January 2025.

## BMF PAP 2025 tax thresholds show three off-by-one errors

The income tax zone boundaries you specified are consistently **one euro too high** for the upper limits. Your values represent the starting points of the *next* zone rather than the upper limits of the current zone. The Grundfreibetrag and all formula coefficients are correct.

| Parameter | Your Value | Official Value | Status |
|-----------|------------|----------------|--------|
| Grundfreibetrag (GFB) | €12,096 | €12,096 | ✅ Correct |
| Zone 1 upper limit | €17,444 | **€17,443** | ⚠️ Off by +1 |
| Zone 2 upper limit | €68,481 | **€68,480** | ⚠️ Off by +1 |
| Zone 3 upper limit | €277,826 | **€277,825** | ⚠️ Off by +1 |

The official zone boundaries from §32a EStG 2025 (per Steuerfortentwicklungsgesetz vom 23.12.2024, BGBl. I Nr. 449) are: Zone 0 (tax-free) up to €12,096; Zone 1 from €12,097 to €17,443; Zone 2 from €17,444 to €68,480; Zone 3 from €68,481 to €277,825; Zone 4 from €277,826 onward.

## All income tax formulas verified as correct

Every coefficient in your four zone formulas matches the official BMF PAP 2025 (Anlage 1, Stand 22.1.2025 endgültig):

- **Zone 1**: ST = (932.30 × Y + 1,400) × Y where Y = (X - 12096) / 10000 ✅
- **Zone 2**: ST = (176.64 × Z + 2,397) × Z + 1,015.13 where Z = (X - 17443) / 10000 ✅
- **Zone 3**: ST = 0.42 × X - 10,911.92 ✅
- **Zone 4**: ST = 0.45 × X - 19,246.67 ✅

These formulas were finalized in the BMF-Schreiben vom 22.01.2025 (IV C 5 - S 2361/00025/014/024) and are mandatory for payroll implementation from March 1, 2025.

## Tax allowances and thresholds all confirmed accurate

| Parameter | Your Value | Verified | Source |
|-----------|------------|----------|--------|
| Solidaritätszuschlag threshold (singles) | €19,950/year | ✅ €19,950 | §3 Abs. 3 SolzG |
| Solidaritätszuschlag threshold (married) | — | €39,900/year | §3 Abs. 3 Nr. 1 SolzG |
| Werbungskostenpauschale | €1,230 | ✅ €1,230 | §9a EStG |
| Sonderausgabenpauschale | €36 | ✅ €36 | §10c EStG |
| VSP2 limit (classes 1,2,4,5,6) | €1,900 | ✅ €1,900 | BMF PAP VHB |
| VSP2 limit (class 3) | €3,000 | ✅ €3,000 | BMF PAP VHB |
| Kinderfreibetrag full (incl. BEA) | €9,600 | ✅ €9,600 | €6,672 + €2,928 |
| Kinderfreibetrag half (per parent) | €4,800 | ✅ €4,800 | €3,336 + €1,464 |
| Entlastungsbetrag Alleinerziehende | €4,260/year | ✅ €4,260 | §24b Abs. 2 EStG |

**Note:** The VSP2 Mindestvorsorgepauschale for private health insurance (PKV) will be abolished from 2026 when actual PKV contribution data transmission becomes mandatory.

## Social security ceilings verified—historic East/West unification confirmed

All Beitragsbemessungsgrenzen values are **correct**, and crucially, **2025 marks the first year of nationwide unified values** with no East/West split:

| Ceiling | Annual | Monthly | Status |
|---------|--------|---------|--------|
| RV/AV (pension/unemployment) | €96,600 | €8,050 | ✅ Correct |
| KV/PV (health/care) | €66,150 | €5,512.50 | ✅ Correct |
| Versicherungspflichtgrenze (general) | €73,800 | €6,150 | Reference |
| Versicherungspflichtgrenze (special) | €66,150 | €5,512.50 | Pre-2003 PKV |

The unification was mandated by the Rentenüberleitungs-Abschlussgesetz of July 2017. Previous 2024 values were €7,550/month (West) and €7,450/month (East). The single €8,050 value now applies to **all German states** per Sozialversicherungsrechengrößen-Verordnung 2025 (BGBl. 2024 I Nr. 365).

## Employee contribution rates verified with important clarifications

All rates you specified are correct. One notable 2025 change: **Pflegeversicherung increased from 3.4% to 3.6%** effective January 1, 2025.

| Insurance | Total Rate | Employee Share | Your Value | Status |
|-----------|------------|----------------|------------|--------|
| Krankenversicherung (base) | 14.6% | 7.3% | 7.3% | ✅ Correct |
| KV Zusatzbeitrag (avg.) | 2.5% | 1.25% | 1.25% | ✅ Correct |
| **Total KV** | **17.1%** | **8.55%** | 8.55% | ✅ Correct |
| Rentenversicherung | 18.6% | 9.3% | 9.3% | ✅ Correct |
| Arbeitslosenversicherung | 2.6% | 1.3% | 1.3% | ✅ Correct |
| Pflegeversicherung (base) | 3.6% | 1.8% | 1.8% | ✅ Correct |
| PV Kinderlosenzuschlag | +0.6% | +0.6% | 0.6% | ✅ Correct |

**Pflegeversicherung graduated rates for parents** (per BVerfG decision 07.04.2022):
- Childless (23+): 2.4% employee share (includes 0.6% surcharge)
- 1 child: 1.8% base rate
- 2 children: 1.55% (−0.25% per child under 25)
- 3 children: 1.30%
- 4 children: 1.05%
- 5+ children: 0.80%

The durchschnittlicher Zusatzbeitrag of **2.5%** was published in Bundesanzeiger on 07.11.2024. Individual Krankenkassen set rates ranging from 1.8% to 4.4%; actual member-weighted average in March 2025 reached approximately 2.9%.

## Minijob and Midijob parameters all verified correct

| Parameter | Your Value | Verified | Calculation/Source |
|-----------|------------|----------|-------------------|
| Minijob limit | €556/month | ✅ €556 | €12.82 × 130 ÷ 3 = €555.53 → rounded |
| 2025 minimum wage | — | €12.82/hour | MindestlohnanpassungsVO |
| Midijob upper limit | €2,000/month | ✅ €2,000 | §20 Abs. 2 SGB IV |
| Gleitzone factor F | 0.6683 | ✅ 0.6683 | 28% ÷ 41.9% |

**Critical clarification on Factor F formula**: Since October 1, 2022, the formula uses **28%** (not 30%) in the numerator. The change removed the 2% Pauschalsteuer component: F = 28% ÷ Gesamtsozialversicherungsbeitragssatz.

The 2025 Gesamtsozialversicherungsbeitragssatz of **41.9%** comprises: RV 18.6% + AV 2.6% + PV 3.6% + KV 14.6% + avg. Zusatzbeitrag 2.5%. Factor F was published in Bundesanzeiger on 10.12.2024.

**Übergangsbereich formulas** (§20 Abs. 2a SGB IV):
- Beitragspflichtige Einnahme: BE = F × G + ([2000/(2000−G)] − [G/(2000−G)] × F) × (AE − G)
- Simplified 2025: BE = 1.127718283 × AE − 255.436565097
- Employee portion: BE_AN = (2000/(2000−G)) × (AE − G) = 1.38504155 × (AE − 556)

## Verification summary and recommendations

| Category | Parameters Checked | Correct | Discrepancies |
|----------|-------------------|---------|---------------|
| Tax zone boundaries | 4 | 1 | 3 (off-by-one) |
| Tax formulas | 4 | 4 | 0 |
| Tax allowances | 9 | 9 | 0 |
| Social security ceilings | 4 | 4 | 0 |
| Contribution rates | 8 | 8 | 0 |
| Minijob/Midijob | 4 | 4 | 0 |
| **Total** | **33** | **30** | **3** |

**Required code corrections:**
1. Change Zone 1 upper limit from €17,444 to **€17,443**
2. Change Zone 2 upper limit from €68,481 to **€68,480**
3. Change Zone 3 upper limit from €277,826 to **€277,825**

**Documentation note:** Verify your Factor F calculation uses 28% (not 30%) in the formula—this changed in October 2022 but older documentation may still reference the 30% value.

**Official source documents:**
- BMF PAP 2025 Anlage 1/2 (Stand 22.1.2025 endgültig)
- Steuerfortentwicklungsgesetz vom 23.12.2024 (BGBl. I Nr. 449)
- Sozialversicherungsrechengrößen-Verordnung 2025 (BGBl. 2024 I Nr. 365)
- §32a EStG, §24b EStG, §3 SolzG via gesetze-im-internet.de
- GKV-Spitzenverband Zusatzbeitrag announcement (Bundesanzeiger 07.11.2024)
- BMAS Factor F publication (Bundesanzeiger 10.12.2024)