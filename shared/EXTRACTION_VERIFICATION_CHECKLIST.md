# AI Payslip Extraction - Verification Checklist

## Step 1: Run the Extraction

### Test Employee
- **Employee ID:** 375
- **Name:** ABDELRAHMAN THARWAT EBRAHIM MOUSTAFA
- **Payslip Month:** September 2025 (09/2025)

### Command to Run
Call `melanieCalculateBrutto` with:
```json
{
  "flowId": "test-extraction-verification",
  "employeeId": "375",
  "month": "10",
  "year": "2025",
  "netto": 100000,
  "orgId": "178f47b1-2a40-4524-a00f-4bd610774c4a",
  "forceRefresh": true
}
```

---

## Step 2: Check Logs

### ✅ Expected Success Log Messages

**1. Force Refresh Confirmation**
```
"⟳ Force refresh requested - skipping cache"
```

**2. Payslip Found**
```
"Found 35 payslip(s) for 09/2025 (1 month back)"
"Employee found in: payslips/.../09-....pdf"
```

**3. Text Extracted**
```
"Extracted XXXX characters of text"
```

**4. NEW: Raw AI Response (Debug Log)**
```json
"Raw AI payslip extraction response"
{
  "brutto": 92700,
  "netto": 81384,
  "taxClass": "1",
  "healthInsuranceRate": 14.60,
  "personnelNumber": "2020271",
  ...
}
```

**5. Parsed Confirmation**
```
"Parsed payslip: brutto=927 EUR, netto=813.84 EUR, confidence=0.95"
```

**6. CRITICAL: Cache Success**
```
"✓ Tax info cached successfully (tax class 1, Pers.-Nr. 2020271)"
```

### ❌ Failure Messages to Watch For

**DO NOT SEE:**
- ❌ "Incomplete BMF parameters, not caching tax info"
- ❌ "Missing context: taxClass=false, healthInsuranceRate=false"
- ❌ "Falling back to AI estimation"

---

## Step 3: Verify Raw AI Output

From the debug log "Raw AI payslip extraction response", check that these fields are present:

### Core Financial (6 fields)
- [ ] `brutto`: 92700 (927.00 EUR)
- [ ] `netto`: 81384 (813.84 EUR)
- [ ] `taxDeductions`: (sum of Lohnsteuer + Kirchensteuer + SolZ)
- [ ] `socialSecurityDeductions`: (sum of KV + RV + AV + PV)
- [ ] `otherDeductions`: 0
- [ ] `confidence`: >= 0.9

### Personal Information (11 fields)
- [ ] `personnelNumber`: "2020271"
- [ ] `socialSecurityNumber`: "19250996M056"
- [ ] `taxIdNumber`: "76435301934"
- [ ] `dateOfBirth`: "1996-09-25" or "25.09.1996"
- [ ] `entryDate`: "2024-07-01" or "01.07.2024"
- [ ] `exitDate`: (optional)
- [ ] `healthInsuranceCompany`: "DAK Gesundheit"
- [ ] `religion`: "--"
- [ ] `personnelGroup`: "101"
- [ ] `department`: (optional)
- [ ] `costCenter`: (optional)

### Tax & Insurance Context (13 fields)
- [ ] `taxClass`: "1" ← **CRITICAL** (was failing before)
- [ ] `churchTax`: false
- [ ] `midijob`: true
- [ ] `multipleEmployment`: false
- [ ] `healthInsuranceRate`: 14.60 ← **CRITICAL** (was failing before)
- [ ] `healthInsuranceEmployeeRate`: 8.70
- [ ] `pensionInsuranceRate`: 18.6
- [ ] `pensionInsuranceEmployeeRate`: 9.3
- [ ] `unemploymentInsuranceRate`: 2.4
- [ ] `unemploymentInsuranceEmployeeRate`: 1.2
- [ ] `careInsuranceRate`: 3.60
- [ ] `careInsuranceEmployeeRate`: 1.80
- [ ] `careInsuranceSurchargeRate`: 0.60

### BMF Parameters (9 fields)
- [ ] `pensionInsuranceType`: 0
- [ ] `healthInsuranceType`: 0
- [ ] `saxonyNursingCare`: false
- [ ] `nursingInsuranceSurcharge`: true
- [ ] `childDependentNursing`: 0
- [ ] `childrenCount`: 0
- [ ] `monthlyTaxAllowance`: 0
- [ ] `monthlyTaxSurcharge`: 0
- [ ] `isOver64`: false

### Days Information (4 objects)
- [ ] `svDaysMonthly`: { kv: 30, rv: 30, av: 30, pv: 30 }
- [ ] `svDaysCumulative`: { kv: 270, rv: 270, av: 270, pv: 270 }
- [ ] `taxDaysMonthly`: 30
- [ ] `taxDaysCumulative`: 270

### Occupational Risk (1 object)
- [ ] `occupationalRiskCategory`: { kv: 1, rv: 1, av: 1, pv: 1 }

### Vacation (4 fields)
- [ ] `vacationPreviousYear`: 0
- [ ] `vacationEntitlement`: 0
- [ ] `vacationTakenMonthly`: 0
- [ ] `vacationRemaining`: 0

### Yearly Accumulated Values (1 object with 16 fields)
- [ ] `yearlyAccumulatedValues`:
  - [ ] `totalGross`: 837995 (8,379.95 EUR)
  - [ ] `taxGross`: 837995
  - [ ] `incomeTax`: 0
  - [ ] `churchTaxAmount`: 0
  - [ ] `solidaritySurcharge`: 0
  - [ ] `healthInsuranceGross`: 730612
  - [ ] `nursingCareGross`: 730612
  - [ ] `pensionInsuranceGross`: 730612
  - [ ] `unemploymentInsuranceGross`: 730612
  - [ ] `healthInsuranceContribution`: 44739
  - [ ] `nursingCareContribution`: 13641
  - [ ] `pensionInsuranceContribution`: 47826
  - [ ] `unemploymentInsuranceContribution`: 6686
  - [ ] `employerSavingsTotal`: 0
  - [ ] `companyPension`: 0
  - [ ] `payoutAmount`: 725103

### Banking Information (1 object with 3 fields)
- [ ] `bankingInfo`:
  - [ ] `iban`: "DE40 1001 1001 2725 7348 87"
  - [ ] `bic`: "NTSBDEB1XXX"
  - [ ] `bankName`: "N26 Bank Berlin"

---

## Step 4: Verify Firestore Document

### Query Firestore
```javascript
db.collection('melanie-employees')
  .doc('375')
  .get()
  .then(doc => {
    console.log('taxInfo:', doc.data().taxInfo);
  });
```

### Check taxInfo Object

**1. Verify New Timestamp**
```javascript
taxInfo.cachedAt // Should be NEW timestamp (not "2025-10-29T06:15:34.310Z")
taxInfo.referenceMonth // Should be "09"
taxInfo.referenceYear // Should be "2025"
```

**2. Count Fields**
```javascript
Object.keys(taxInfo).length // Should be approximately 60 fields
```

**3. Verify Critical Fields Are Present**
```javascript
taxInfo.taxClass === 1 // ✅ Should be 1 (number, converted from "1" string)
taxInfo.healthInsuranceRate === 14.60 // ✅ Should be 14.60
taxInfo.personnelNumber === "2020271" // ✅ Should be "2020271"
taxInfo.socialSecurityNumber === "19250996M056" // ✅ Should be present
taxInfo.healthInsuranceCompany === "DAK Gesundheit" // ✅ Should be present
```

**4. Verify Nested Objects**
```javascript
taxInfo.yearlyAccumulatedValues.totalGross === 837995 // ✅ Should be present
taxInfo.bankingInfo.iban === "DE40 1001 1001 2725 7348 87" // ✅ Should be present
taxInfo.occupationalRiskCategory.kv === 1 // ✅ Should be present
```

---

## Step 5: Validate Complete Field List

### Expected Fields in taxInfo (60 total)

**Personal Information (11)**
1. personnelNumber
2. socialSecurityNumber
3. taxIdNumber
4. dateOfBirth
5. entryDate
6. exitDate
7. healthInsuranceCompany
8. religion
9. personnelGroup
10. department
11. costCenter

**Employment Status (2)**
12. midijob
13. multipleEmployment

**BMF Tax Parameters (11)**
14. taxClass
15. pensionInsuranceType
16. healthInsuranceType
17. saxonyNursingCare
18. nursingInsuranceSurcharge
19. childDependentNursing
20. churchTax
21. childrenCount
22. monthlyTaxAllowance
23. monthlyTaxSurcharge
24. isOver64

**Insurance Rates (9)**
25. healthInsuranceRate
26. healthInsuranceEmployeeRate
27. pensionInsuranceRate
28. pensionInsuranceEmployeeRate
29. unemploymentInsuranceRate
30. unemploymentInsuranceEmployeeRate
31. careInsuranceRate
32. careInsuranceEmployeeRate
33. careInsuranceSurchargeRate

**Occupational Risk Category (4 sub-fields in 1 object)**
34. occupationalRiskCategory.kv
35. occupationalRiskCategory.rv
36. occupationalRiskCategory.av
37. occupationalRiskCategory.pv

**Vacation Entitlement (1)**
38. vacationEntitlement

**Yearly Accumulated Values (16 sub-fields in 1 object)**
39. yearlyAccumulatedValues.totalGross
40. yearlyAccumulatedValues.taxGross
41. yearlyAccumulatedValues.incomeTax
42. yearlyAccumulatedValues.churchTaxAmount
43. yearlyAccumulatedValues.solidaritySurcharge
44. yearlyAccumulatedValues.healthInsuranceGross
45. yearlyAccumulatedValues.nursingCareGross
46. yearlyAccumulatedValues.pensionInsuranceGross
47. yearlyAccumulatedValues.unemploymentInsuranceGross
48. yearlyAccumulatedValues.healthInsuranceContribution
49. yearlyAccumulatedValues.nursingCareContribution
50. yearlyAccumulatedValues.pensionInsuranceContribution
51. yearlyAccumulatedValues.unemploymentInsuranceContribution
52. yearlyAccumulatedValues.employerSavingsTotal
53. yearlyAccumulatedValues.companyPension
54. yearlyAccumulatedValues.payoutAmount

**Banking Information (3 sub-fields in 1 object)**
55. bankingInfo.iban
56. bankingInfo.bic
57. bankingInfo.bankName

**Cache Metadata (3)**
58. referenceMonth
59. referenceYear
60. cachedAt

---

## Success Criteria

### ✅ ALL Must Pass

1. **Logs show:**
   - [ ] "Raw AI payslip extraction response" with all fields
   - [ ] "Tax info cached successfully"
   - [ ] NO "Incomplete BMF parameters" message

2. **Raw AI output contains:**
   - [ ] `taxClass`: "1" (string)
   - [ ] `healthInsuranceRate`: 14.60 (number)
   - [ ] All 60 expected fields present

3. **Firestore document has:**
   - [ ] Fresh timestamp in `cachedAt`
   - [ ] All 60 fields in `taxInfo`
   - [ ] `taxClass` = 1 (converted to number)
   - [ ] `healthInsuranceRate` = 14.60

4. **User confirmation:**
   - [ ] No more missing fields
   - [ ] All requested payslip attributes are present
   - [ ] Data matches what's on the actual payslip PDF

---

## If Something Fails

### Debug Steps

1. **Check the raw AI response log**
   - Is the AI returning the field?
   - Is it in the wrong format?

2. **Check if cache logic skipped the field**
   - Look at `calculateBrutto.ts` lines 307-365
   - Verify field is being mapped from `parsed` to `taxInfo`

3. **Check for type mismatches**
   - `taxClass` must be string in AI output, converted to number in cache
   - Rates must be numbers with decimal points

4. **Re-run with fresh data**
   - Clear cache, run again with `forceRefresh: true`

---

## Report Results

After testing, report:
- [ ] ✅ Extraction successful / ❌ Failed
- [ ] Number of fields in Firestore taxInfo: _____
- [ ] Missing fields (if any): _____
- [ ] Any error messages: _____
