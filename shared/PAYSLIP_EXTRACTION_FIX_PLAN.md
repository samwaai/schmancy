# Payslip AI Extraction - Fix Plan

## FOCUS: AI EXTRACTION + FIRESTORE SAVE

### ONLY TWO THINGS
1. **AI extracts ALL attributes from payslip** (60 fields)
2. **Save ALL extracted data to employee Firestore document** (`taxInfo` field)

### Expected Attributes (from payslip examples)
Based on actual German payslips, the following must be extracted:

#### Header Information
- Pers.-Nr. (Personnel Number)
- SV-Nummer (Social Security Number)
- Steuer ID Nr. (Tax ID)
- Geb.datum (Date of Birth)
- Eintritt (Entry Date)
- Austritt (Exit Date)
- Kasse (Health Insurance Company)
- St.Kl. (Faktor) / Kinder (Tax Class / Children)
- Konfession (Religion)
- Personengruppe (Personnel Group)
- Abteilung (Department)
- Kst.-St. (Cost Center)

#### Insurance Rates
- KV / AN-Beitrag KV (Health Insurance Total / Employee Share)
- PV (Beitrag/AN/Zu.) (Nursing Care Total / Employee / Surcharge)
- Übergangsbereich (Midijob Status)
- MFB (Multiple Employment Factor)

#### Days Information
- SV-Tage monatlich (KV, RV, AV, PV)
- SV-Tage kumuliert (KV, RV, AV, PV)
- St.-Tage monatlich/kumuliert
- BGR (Occupational Risk Category)

#### Vacation Information
- Urlaub Vorjahr
- Urlaubsanspruch
- Urlaub - monatlich genommen
- Resturlaub

#### Accumulated Yearly Values (Aufgelaufene Jahreswerte)
- Gesamtbrutto
- Steuer - Brutto
- Lohnsteuer
- Kirchensteuer
- SolZ
- KV - Brutto / KV - Beitrag
- PV - Brutto / PV - Beitrag
- RV - Brutto / RV - Beitrag
- AV - Brutto / AV - Beitrag
- VWL - Gesamt
- Betriebl. Altersversorgung
- Auszahlungsbetrag

#### Banking Information
- IBAN
- BIC
- Bank

---

## CURRENT PROBLEM

### AI is NOT extracting fields
```
Logs show: "taxClass":false, "healthInsuranceRate":false
```

### What should happen
```
Payslip text:  "St.Kl. (Faktor) / Kinder 1 / 0,0"
AI should extract: taxClass: "1"

Payslip text: "KV / AN-Beitrag KV 14,60% / 8,70%"
AI should extract: healthInsuranceRate: 14.60
```

### Why Firestore save is failing
```typescript
// calculateBrutto.ts line 302
if (parsed.taxClass && parsed.pensionInsuranceType !== undefined && parsed.healthInsuranceType !== undefined) {
  // SAVE TO FIRESTORE
}
```

Because `taxClass` is missing → Firestore write is SKIPPED → User sees old data

---

## FIX PLAN

### FILE TO MODIFY
`firebase/functions/src/melanie/payroll/parsePayslipWithAI.ts`

### WHAT TO FIX
The AI prompt must extract ALL 60 fields correctly and save them to Firestore.

### STEP 1: Fix AI Extraction for ALL Fields

Review and fix the AI prompt to ensure every field is extracted:

**File:** `firebase/functions/src/melanie/payroll/parsePayslipWithAI.ts`
**Lines:** 10-270 (the entire prompt)

**Requirement:** Every field in the payslip must:
1. Be defined in the schema (lines 18-118)
2. Have an extraction rule (lines 120-210)
3. Have an example (lines 212-268)

**Critical fields currently failing:**
- `taxClass` - from "St.Kl. (Faktor) / Kinder 1 / 0,0"
- `healthInsuranceRate` - from "KV / AN-Beitrag KV 14,60% / 8,70%"

### STEP 2: Verify Firestore Save Logic

**File:** `firebase/functions/src/melanie/payroll/calculateBrutto.ts`
**Lines:** 302-365

**Current logic:**
```typescript
if (parsed.taxClass && parsed.pensionInsuranceType !== undefined && parsed.healthInsuranceType !== undefined) {
  const taxInfo: BMFTaxInfo = {
    // ... all 60 fields mapped from parsed ...
  };

  dbMelanie.collection("employees").doc(employeeId).update({ taxInfo });
}
```

**This is CORRECT** - just needs AI to extract the fields

### STEP 3: Test

1. Run `melanieCalculateBrutto` with `forceRefresh: true`
2. Check logs - should see "Tax info cached successfully"
3. Check Firestore - employee document should have `taxInfo` with 60 fields

---

## EXECUTION STEPS

### Step 1: Fix the AI Prompt
Edit `firebase/functions/src/melanie/payroll/parsePayslipWithAI.ts` to ensure all fields are extracted correctly

### Step 2: Test
Run extraction and verify all 60 fields are saved to Firestore

### Step 3: Done
User has all data in employee document
