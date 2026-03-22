# DNS Records Setup for Email Deliverability

This guide will help you set up the necessary DNS records to prevent emails from going to spam when using Resend.

## Domain: elorasilver.com

### Step 1: Verify Your Domain in Resend

1. Log in to your [Resend Dashboard](https://resend.com/domains)
2. Add your domain: `elorasilver.com`
3. Resend will provide you with specific DNS records to add

### Step 2: Add DNS Records

Add the following DNS records in your domain registrar's DNS management panel (e.g., GoDaddy, Namecheap, Cloudflare, etc.):

#### 1. SPF Record (Sender Policy Framework)

**Type:** `TXT`  
**Name/Host:** `@` (or leave blank, or `elorasilver.com`)  
**Value:**
```
v=spf1 include:spf.resend.com ~all
```

**Purpose:** Tells email servers that Resend is authorized to send emails on behalf of your domain.

---

#### 2. DKIM Record (DomainKeys Identified Mail)

**Type:** `TXT`  
**Name/Host:** `default._domainkey` (or `default._domainkey.elorasilver.com` depending on your DNS provider)  
**Value:** *(Get this from your Resend dashboard after adding your domain)*

**Purpose:** Adds a digital signature to your emails to prove they haven't been tampered with.

**Note:** The exact DKIM value will be provided by Resend when you add your domain. It will look something like:
```
v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...
```

---

#### 3. DMARC Record (Domain-based Message Authentication)

**Type:** `TXT`  
**Name/Host:** `_dmarc` (or `_dmarc.elorasilver.com`)  
**Value:**
```
v=DMARC1; p=none; rua=mailto:info@elorasilver.com; ruf=mailto:info@elorasilver.com; fo=1
```

**Purpose:** Tells receiving email servers how to handle emails that fail SPF or DKIM checks.

**Explanation:**
- `p=none` - Start with "none" policy (monitoring only, no action taken)
- `rua=mailto:info@elorasilver.com` - Where to send aggregate reports
- `ruf=mailto:info@elorasilver.com` - Where to send forensic reports
- `fo=1` - Generate reports for all failures

**After monitoring for a few weeks, you can change to:**
- `p=quarantine` - Quarantine emails that fail authentication
- `p=reject` - Reject emails that fail authentication

---

### Step 3: Verify Records Are Working

After adding the DNS records:

1. **Wait for DNS propagation** (can take a few minutes to 48 hours, usually 15-30 minutes)
2. **Verify in Resend Dashboard** - Resend will check if the records are correctly configured
3. **Test with online tools:**
   - [MXToolbox SPF Check](https://mxtoolbox.com/spf.aspx)
   - [MXToolbox DMARC Check](https://mxtoolbox.com/dmarc.aspx)
   - [DKIM Validator](https://dkimvalidator.com/)

---

### Common DNS Provider Instructions

#### Cloudflare
1. Go to your domain → DNS → Records
2. Click "Add record"
3. Select Type: `TXT`
4. Enter Name and Value as specified above
5. Click Save

#### GoDaddy
1. Go to DNS Management
2. Click "Add" under Records
3. Select Type: `TXT`
4. Enter Host and TXT Value
5. Click Save

#### Namecheap
1. Go to Domain List → Manage → Advanced DNS
2. Click "Add New Record"
3. Select Type: `TXT Record`
4. Enter Host and Value
5. Click Save

---

### Important Notes

- DNS changes can take up to 48 hours to propagate globally, but usually happen within 15-30 minutes
- Make sure you don't have duplicate SPF records - if you already have one, you need to modify it to include Resend
- The DKIM key from Resend is unique to your account - make sure to use the exact value they provide
- Start with `p=none` for DMARC and monitor reports before moving to stricter policies

---

### Troubleshooting

**If emails still go to spam:**
1. Verify all DNS records are correctly added and propagated
2. Check that the "from" email address in your code matches your verified domain
3. Ensure you're not sending too many emails too quickly
4. Check your domain's reputation using [Google Postmaster Tools](https://postmaster.google.com/)
5. Make sure your email content isn't triggering spam filters (avoid spam trigger words, excessive links, etc.)

