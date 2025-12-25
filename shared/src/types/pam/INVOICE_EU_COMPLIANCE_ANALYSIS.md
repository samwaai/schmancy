# Invoice System EU Compliance Analysis

## Current Implementation Gaps

### 1. **CRITICAL: Currency Hardcoding**
**Issue:** Line 73 in `create-invoice.ts` hardcodes `currency: "EUR"`
**Impact:** Cannot invoice in other EU currencies (SEK, DKK, PLN, CZK, HUF, etc.)
**Fix:** Accept currency from request, validate against supported currencies

### 2. **CRITICAL: German-Only Validation**
**Issue:** `validateGermanCompliance()` only checks German §14 UStG requirements
**Impact:** Invoices to other EU countries may not be legally valid
**Fix:** Create EU-wide validation with country-specific rules

### 3. **CRITICAL: Fixed VAT Rates**
**Issue:** Only supports 0%, 7%, 19% (German rates)
**Impact:** Cannot invoice with other EU VAT rates (e.g., France 20%, Spain 21%, Italy 22%)
**Fix:** Dynamic VAT rate validation per country

### 4. **CRITICAL: Missing Reverse Charge**
**Issue:** No support for B2B cross-border reverse charge mechanism
**Impact:** Incorrect VAT on intra-EU B2B transactions
**Fix:** Add reverse charge logic and invoice marking

### 5. **Missing VAT ID Validation**
**Issue:** No VIES validation for intra-EU VAT IDs
**Impact:** Cannot verify customer VAT IDs for 0% VAT eligibility
**Fix:** Integrate VIES API for real-time validation

### 6. **Single Language**
**Issue:** PDF and labels only in German
**Impact:** Non-compliant for invoices to other EU countries
**Fix:** Multi-language support (EN, DE, FR, ES, IT, etc.)

### 7. **Missing Invoice Types**
**Issue:** No support for credit notes, proforma, self-billing
**Impact:** Cannot handle all business scenarios
**Fix:** Add invoice type field with proper handling

### 8. **No Country Detection**
**Issue:** System doesn't detect payee/payer countries
**Impact:** Cannot apply country-specific rules
**Fix:** Add country codes, detect from VAT ID or address

## EU Invoicing Requirements by Scenario

### Scenario 1: Domestic (Same Country)
- Apply local VAT rates
- Local language
- Country-specific mandatory fields
- Local invoice numbering rules

### Scenario 2: Intra-EU B2B (Business to Business)
- **Reverse charge**: 0% VAT
- Must show: "Reverse charge - VAT to be paid by recipient"
- Validate both VAT IDs (VIES)
- Invoice in supplier or customer language
- Both VAT IDs must be shown

### Scenario 3: Intra-EU B2C (Business to Consumer)
- **Distance selling**: Apply destination country VAT if over threshold
- Or use supplier country VAT if under threshold
- OSS (One Stop Shop) scheme support
- Customer country language preferred

### Scenario 4: Export (Non-EU)
- 0% VAT
- Must show: "Export - Outside EU"
- Customs documentation
- Proof of export
- English language acceptable

### Scenario 5: Import (Non-EU to EU)
- Reverse charge or import VAT
- Show: "Import - VAT on customs declaration"
- Customs reference

## Required Fields by EU Country

### All EU Countries (Minimum)
1. Supplier name and address
2. Supplier VAT ID (if registered)
3. Customer name and address
4. Customer VAT ID (for B2B)
5. Invoice number (sequential)
6. Issue date
7. Delivery/service date (or period)
8. Item description
9. Quantity and unit
10. Unit price (excluding VAT)
11. VAT rate
12. VAT amount
13. Total amount
14. Currency
15. Payment terms

### Country-Specific Additions

**Germany (§14 UStG):**
- Tax number OR VAT ID (mandatory)
- "Steuernummer" or "USt-IdNr"

**France:**
- SIRET number (for French businesses)
- Mention "TVA non applicable, art. 293 B du CGI" (if VAT exempt)

**Spain:**
- NIF (Número de Identificación Fiscal)
- Must show "IVA incluido" or "IVA no incluido"

**Italy:**
- Codice Fiscale
- E-invoice mandate (FatturaPA for B2G, optional for B2B)
- Split payment mechanism for public sector

**Poland:**
- NIP (VAT ID)
- Bank account number (for certain transactions)
- Split payment mechanism ("split payment" marker)

**Netherlands:**
- KVK number (Chamber of Commerce)
- VAT shifted if reverse charge

**Belgium:**
- Company registration number
- VAT rate breakdown mandatory

## VAT Rates by EU Country (2025)

| Country | Standard | Reduced | Super-Reduced |
|---------|----------|---------|---------------|
| Austria | 20% | 10%, 13% | - |
| Belgium | 21% | 6%, 12% | - |
| Bulgaria | 20% | 9% | - |
| Croatia | 25% | 5%, 13% | - |
| Cyprus | 19% | 5%, 9% | - |
| Czech Republic | 21% | 10%, 15% | - |
| Denmark | 25% | - | - |
| Estonia | 22% | 9% | - |
| Finland | 25.5% | 10%, 14% | - |
| France | 20% | 5.5%, 10% | 2.1% |
| Germany | 19% | 7% | - |
| Greece | 24% | 6%, 13% | - |
| Hungary | 27% | 5%, 18% | - |
| Ireland | 23% | 9%, 13.5% | 4.8% |
| Italy | 22% | 5%, 10% | 4% |
| Latvia | 21% | 5%, 12% | - |
| Lithuania | 21% | 5%, 9% | - |
| Luxembourg | 17% | 8%, 14% | 3% |
| Malta | 18% | 5%, 7% | - |
| Netherlands | 21% | 9% | - |
| Poland | 23% | 5%, 8% | - |
| Portugal | 23% | 6%, 13% | - |
| Romania | 19% | 5%, 9% | - |
| Slovakia | 20% | 10% | - |
| Slovenia | 22% | 5%, 9.5% | - |
| Spain | 21% | 10% | 4% |
| Sweden | 25% | 6%, 12% | - |

## Reverse Charge Rules

### When to Apply
1. **B2B Intra-EU**: Supplier in one EU country, customer in another, both VAT registered
2. **Services**: Most B2B services follow "place of supply" rules
3. **Construction**: Certain construction services in some countries
4. **Scrap metal, mobile phones, etc.**: Specific goods

### How to Mark
Invoice must show:
- 0% VAT
- Text: "Reverse charge - Customer to account for VAT"
- Or local equivalent:
  - DE: "Steuerschuldnerschaft des Leistungsempfängers"
  - FR: "Autoliquidation"
  - ES: "Inversión del sujeto pasivo"
  - IT: "Reverse charge"

## E-Invoicing Standards

### Mandatory E-Invoicing
**Italy**: FatturaPA (since 2019)
**France**: Chorus Pro for B2G (2020), B2B mandatory from 2026
**Germany**: XRechnung for B2G (since 2020), ZUGFeRD recommended
**Poland**: KSeF (National e-Invoice System) mandatory from 2024
**Spain**: Mandatory e-invoicing from 2025

### Formats
- **Peppol**: Pan-European standard
- **XRechnung**: German standard (XML)
- **ZUGFeRD**: Hybrid PDF + XML (Germany)
- **FatturaPA**: Italian standard (XML)
- **Facturae**: Spanish standard (XML)
- **UBL**: Universal Business Language (XML)

## Required Improvements

### Phase 1: Multi-Currency & Country Support
1. Add country code to `InvoiceParty`
2. Remove hardcoded EUR
3. Add currency validation
4. Detect country from VAT ID prefix
5. Add country-specific validation functions

### Phase 2: Dynamic VAT Handling
1. VAT rate configuration per country
2. Reverse charge detection and application
3. Distance selling threshold tracking
4. OSS scheme support
5. VAT validation by country

### Phase 3: VIES Integration
1. Real-time VAT ID validation
2. Cache validation results
3. Fallback for API downtime
4. Log validation attempts

### Phase 4: Multi-Language
1. Translation system for invoice labels
2. Language detection from country
3. Multi-language PDF templates
4. Date/number formatting per locale

### Phase 5: Invoice Types
1. Add `invoiceType` field (invoice, credit_note, proforma, self_billing)
2. Validation rules per type
3. PDF templates per type
4. Sequential numbering per type

### Phase 6: E-Invoicing
1. XRechnung/ZUGFeRD generation
2. Peppol network integration
3. Format conversion utilities
4. Archiving and retrieval

## Legal Compliance Checklist

### General EU Requirements
- [ ] Invoice numbering is sequential and unique
- [ ] Invoices stored for required period (varies by country, typically 7-10 years)
- [ ] Invoices immutable after finalization
- [ ] Audit trail of all changes
- [ ] Accessible for tax authorities
- [ ] Machine-readable format available
- [ ] Currency clearly stated
- [ ] All amounts in same currency or conversion shown
- [ ] VAT breakdown by rate
- [ ] Payment terms clear

### B2B Intra-EU Specific
- [ ] Both VAT IDs shown and validated
- [ ] Reverse charge mentioned
- [ ] 0% VAT applied
- [ ] Recapitulative statement (EC Sales List) reportable
- [ ] Intrastat declaration if over threshold

### B2C Cross-Border
- [ ] Distance selling threshold tracked
- [ ] Correct VAT rate applied
- [ ] OSS returns if applicable

### Export/Import
- [ ] Customs documentation reference
- [ ] Proof of export maintained
- [ ] Incoterms stated
- [ ] Country of origin shown (if required)

## Recommended Implementation Priority

1. **URGENT**: Remove EUR hardcoding, add currency field
2. **URGENT**: Add country detection
3. **URGENT**: Create EU-wide validation framework
4. **HIGH**: Implement reverse charge logic
5. **HIGH**: Add dynamic VAT rates per country
6. **HIGH**: VIES VAT ID validation
7. **MEDIUM**: Multi-language support
8. **MEDIUM**: Invoice types (credit notes, etc.)
9. **LOW**: E-invoicing formats (can be Phase 2)
10. **LOW**: Full localization (date formats, etc.)

## Risk Assessment

**Current State**: **HIGH RISK**
- Invoices to non-German EU countries may not be legally valid
- Incorrect VAT treatment on cross-border transactions
- Potential fines and penalties
- Tax audit failures

**After Phase 1-3**: **MEDIUM RISK**
- Basic EU compliance achieved
- Core VAT rules correctly applied
- Still manual language handling

**After Phase 4-6**: **LOW RISK**
- Full EU compliance
- Automated validation
- E-invoicing ready
- Multi-market scalable
