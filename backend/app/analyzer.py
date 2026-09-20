import re
from typing import List, Dict, Any, Optional, Tuple

class RuleBasedAnalyzer:
    def __init__(self):
        self.high_risk_patterns = {
            'payment_request': {
                'patterns': [
                    r'pay\s*[₹\d,\.]+\s*(?:fee|amount)',
                    r'registration\s*fee',
                    r'processing\s*fee',
                    r'security\s*deposit',
                    r'training\s*fee',
                    r'payment\s*before\s*joining',
                    r'pay\s*(?:us|our|the)\s*(?:company|organization)',
                    r'fee\s*of\s*[₹\d]',
                    r'cost\s*of\s*[₹\d]',
                ],
                'severity': 'CRITICAL',
                'icon': '🔴',
                'title': 'Payment Request',
                'description': 'This opportunity asks candidates to pay money.',
                'recommendation': 'Do not make any payment. Legitimate employers do not require payment for internships or jobs.',
                'score': 25  # Increased from 20
            },
            'otp_request': {
                'patterns': [
                    r'OTP',
                    r'one[- ]time[- ]password',
                    r'verification\s*code',
                ],
                'severity': 'CRITICAL',
                'icon': '🔴',
                'title': 'OTP Request',
                'description': 'The opportunity asks for OTP or verification codes.',
                'recommendation': 'Never share OTPs or verification codes with anyone.',
                'score': 30
            },
            'password_request': {
                'patterns': [
                    r'password',
                    r'passcode',
                    r'pin',
                ],
                'severity': 'CRITICAL',
                'icon': '🔴',
                'title': 'Password Request',
                'description': 'This opportunity asks for passwords or PINs.',
                'recommendation': 'Never share passwords or PINs. This is a common scam tactic.',
                'score': 30
            },
            'banking_info': {
                'patterns': [
                    r'bank\s*(?:account|details|info)',
                    r'account\s*number',
                    r'IFSC',
                    r'UPI',
                    r'debit\s*card',
                    r'credit\s*card',
                    r'CVV',
                ],
                'severity': 'CRITICAL',
                'icon': '🔴',
                'title': 'Banking Information Request',
                'description': 'The opportunity asks for banking or payment details.',
                'recommendation': 'Do not share banking information. Only provide this to verified employers through secure channels.',
                'score': 25
            },
            'sensitive_personal': {
                'patterns': [
                    r'Aadhar',
                    r'PAN',
                    r'passport',
                    r'social\s*security',
                    r'SSN',
                    r'driving\s*license',
                ],
                'severity': 'HIGH',
                'icon': '⚠️',
                'title': 'Sensitive Personal Information',
                'description': 'This opportunity asks for sensitive personal identification documents.',
                'recommendation': 'Verify the legitimacy of the opportunity before sharing personal documents.',
                'score': 20
            },
            'guaranteed_job': {
                'patterns': [
                    r'guaranteed\s*(?:job|position|placement|selection)',
                    r'100%\s*(?:placement|selection|job)',
                    r'assured\s*(?:job|selection)',
                    r'selected\s*for\s*(?:our|the)\s*(?:internship|program|position)',
                    r'congratulations.*selected',
                ],
                'severity': 'HIGH',
                'icon': '⚠️',
                'title': 'Guaranteed/False Selection Claim',
                'description': 'The opportunity guarantees selection or claims you are already selected.',
                'recommendation': 'No legitimate employer can guarantee a job without an interview process.',
                'score': 18
            },
            'unrealistic_salary': {
                'patterns': [
                    r'[₹]?\s*[0-9,]+[0-9]{4,}\s*(?:per\s*(?:month|year|annum))',
                    r'lakhs?\s*(?:per\s*(?:month|year))',
                    r'high\s*salary',
                ],
                'severity': 'HIGH',
                'icon': '⚠️',
                'title': 'Unrealistic Salary Offer',
                'description': 'The salary offered seems unusually high for the role.',
                'recommendation': 'Research typical salaries for the role and location.',
                'score': 15
            },
            'urgency': {
                'patterns': [
                    r'offer\s*expires\s*(?:today|tomorrow|soon)',
                    r'limited\s*(?:seats|positions|slots)',
                    r'act\s*(?:now|immediately|fast)',
                    r'hurry\s*up',
                    r'last\s*chance',
                    r'only\s*[0-9]+\s*(?:seats|spots|positions)',
                ],
                'severity': 'HIGH',
                'icon': '⚠️',
                'title': 'Urgency Tactics',
                'description': 'The opportunity uses high-pressure urgency tactics.',
                'recommendation': 'Legitimate opportunities do not pressure you to act immediately. Take time to verify.',
                'score': 15
            },
            'fake_selection': {
                'patterns': [
                    r'congratulat[a-z]*\s*(?:you|your)\s*(?:are|have)\s*selected',
                    r'selected\s*for\s*internship',
                    r'selected\s*for\s*position',
                    r'you\s*(?:are|have)\s*shortlisted',
                    r'pre-selected',
                ],
                'severity': 'HIGH',
                'icon': '⚠️',
                'title': 'Fake Selection Claim',
                'description': 'Claims you have been selected without an interview process.',
                'recommendation': 'Always complete the proper application and interview process before accepting any offer.',
                'score': 18
            }
        }
        
        self.medium_risk_patterns = {
            'personal_email': {
                'patterns': [
                    r'@gmail\.com',
                    r'@yahoo\.com',
                    r'@outlook\.com',
                    r'@hotmail\.com',
                    r'@rediffmail\.com',
                ],
                'severity': 'MEDIUM',
                'icon': '📧',
                'title': 'Personal Email Domain',
                'description': 'Recruiter is using a personal email domain (Gmail, Yahoo, etc.).',
                'recommendation': 'Legitimate companies usually use their own domain for professional communication.',
                'score': 10
            },
            'whatsapp_contact': {
                'patterns': [
                    r'whatsapp',
                    r'WhatsApp',
                ],
                'severity': 'MEDIUM',
                'icon': '💬',
                'title': 'WhatsApp Communication',
                'description': 'Communication is primarily through WhatsApp.',
                'recommendation': 'Legitimate companies typically use official email or portals for communication.',
                'score': 8
            },
            'telegram_contact': {
                'patterns': [
                    r'telegram',
                    r'Telegram',
                ],
                'severity': 'MEDIUM',
                'icon': '💬',
                'title': 'Telegram Communication',
                'description': 'Communication is primarily through Telegram.',
                'recommendation': 'Be cautious of opportunities that only communicate through messaging apps.',
                'score': 8
            },
            'suspicious_url': {
                'patterns': [
                    r'bit\.ly',
                    r'tinyurl\.com',
                    r'goo\.gl',
                    r'ow\.ly',
                    r'[a-z0-9-]+\.(?:xyz|click|top|club|online)',
                ],
                'severity': 'MEDIUM',
                'icon': '🔗',
                'title': 'Suspicious URL',
                'description': 'The opportunity contains shortened or suspicious URLs.',
                'recommendation': 'Check the URL before clicking. Legitimate companies use their own domain.',
                'score': 8
            },
            'poor_grammar': {
                'patterns': [
                    r'\b(?:ur|u|r)\b',
                    r'\b(?:pls|plz)\b',
                    r'\b(?:thx|thanx)\b',
                    r'[a-z]{20,}',
                ],
                'severity': 'MEDIUM',
                'icon': '📝',
                'title': 'Poor Grammar & Spelling',
                'description': 'The message contains poor grammar, spelling errors, or informal language.',
                'recommendation': 'Professional companies send well-written communications.',
                'score': 6
            },
            'missing_interview': {
                'patterns': [
                    r'no\s*(?:interview|technical\s*round)',
                    r'direct\s*selection',
                    r'without\s*(?:any|an)\s*interview',
                ],
                'severity': 'MEDIUM',
                'icon': '❌',
                'title': 'No Interview Process',
                'description': 'No interview or application process is mentioned.',
                'recommendation': 'Legitimate companies always have some form of interview or screening process.',
                'score': 8
            },
            'missing_company_info': {
                'patterns': [
                    r'no\s*company\s*name',
                    r'unknown\s*company',
                ],
                'severity': 'MEDIUM',
                'icon': '🏢',
                'title': 'Missing Company Information',
                'description': 'The company name or details are not clearly mentioned.',
                'recommendation': 'Research the company before proceeding.',
                'score': 6
            }
        }
        
        self.positive_patterns = {
            'company_domain': {
                'patterns': [
                    r'@[a-z0-9-]+\.(?:com|org|in|io|ai|dev)',
                ],
                'severity': 'POSITIVE',
                'icon': '✅',
                'title': 'Official Company Domain',
                'description': 'The communication comes from an official company domain.',
                'recommendation': 'This is a positive signal. Continue with verification.',
                'score': -8
            },
            'detailed_jd': {
                'patterns': [
                    r'responsibilities?',
                    r'requirements?',
                    r'qualifications?',
                    r'skills\s*(?:required|needed)',
                    r'about\s*the\s*role',
                ],
                'severity': 'POSITIVE',
                'icon': '✅',
                'title': 'Detailed Job Description',
                'description': 'A comprehensive job description is provided.',
                'recommendation': 'Good sign - indicates a professional opportunity.',
                'score': -5
            },
            'interview_process': {
                'patterns': [
                    r'interview\s*(?:process|round|schedule)',
                    r'technical\s*(?:interview|round|assessment)',
                    r'coding\s*(?:test|challenge|assessment)',
                    r'round\s*[0-9]',
                ],
                'severity': 'POSITIVE',
                'icon': '✅',
                'title': 'Interview Process Mentioned',
                'description': 'The interview or selection process is clearly mentioned.',
                'recommendation': 'Professional opportunities have structured interview processes.',
                'score': -5
            },
            'official_careers_page': {
                'patterns': [
                    r'careers\.[a-z0-9-]+\.(?:com|org|in)',
                    r'careers\s*page',
                    r'apply\s*through\s*(?:our|the)\s*(?:website|portal|careers)',
                ],
                'severity': 'POSITIVE',
                'icon': '✅',
                'title': 'Official Careers Page Mentioned',
                'description': 'An official careers page or application portal is mentioned.',
                'recommendation': 'This is a positive signal. Apply through official channels.',
                'score': -5
            }
        }

    def analyze(self, text: str) -> Tuple[int, List[Dict], List[Dict]]:
        """Analyze text and return risk score, indicators, and verification data"""
        indicators = []
        verification_items = []
        risk_score = 0
        critical_count = 0
        high_count = 0
        
        # Check high risk patterns
        for key, config in self.high_risk_patterns.items():
            evidence = self._find_patterns(text, config['patterns'])
            if evidence:
                risk_score += config['score']
                if config['severity'] == 'CRITICAL':
                    critical_count += 1
                else:
                    high_count += 1
                indicators.append({
                    'severity': config['severity'],
                    'icon': config['icon'],
                    'title': config['title'],
                    'description': config['description'],
                    'evidence': evidence[:200] + '...' if len(evidence) > 200 else evidence,
                    'recommendation': config['recommendation']
                })
        
        # Check medium risk patterns
        for key, config in self.medium_risk_patterns.items():
            evidence = self._find_patterns(text, config['patterns'])
            if evidence:
                risk_score += config['score']
                indicators.append({
                    'severity': config['severity'],
                    'icon': config['icon'],
                    'title': config['title'],
                    'description': config['description'],
                    'evidence': evidence[:200] + '...' if len(evidence) > 200 else evidence,
                    'recommendation': config['recommendation']
                })
        
        # Check positive patterns and reduce score
        positive_signals = []
        for key, config in self.positive_patterns.items():
            if self._find_patterns(text, config['patterns']):
                risk_score += config['score']  # This adds a negative number
                positive_signals.append({
                    'label': config['title'],
                    'status': '✅',
                    'detail': config['description']
                })
        
        # Apply multiplier for critical signals
        if critical_count > 0:
            # Each critical signal adds a bonus multiplier
            risk_score = int(risk_score * (1 + (critical_count * 0.15)))
        
        # Ensure score is within 0-100
        risk_score = max(0, min(100, risk_score))
        
        # Build verification checklist
        verification_items = self._build_verification(text, indicators)
        
        # Add positive signals to verification
        for signal in positive_signals:
            verification_items.append({
                'label': signal['label'],
                'status': '✅',
                'detail': signal['detail']
            })
        
        return risk_score, indicators, verification_items
    
    def _find_patterns(self, text: str, patterns: List[str]) -> Optional[str]:
        """Find matching patterns in text and return the matched text"""
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                start = max(0, match.start() - 50)
                end = min(len(text), match.end() + 50)
                context = text[start:end]
                return context.strip()
        return None
    
    def _build_verification(self, text: str, indicators: List[Dict]) -> List[Dict]:
        """Build verification checklist based on analysis"""
        checks = {
            'Company identity': {'status': '⚠', 'detail': 'Needs verification'},
            'Recruiter verification': {'status': '⚠', 'detail': 'Unable to verify'},
            'Payment request': {'status': '✅', 'detail': 'No payment requested'},
            'Official website': {'status': '⚠', 'detail': 'Not verified'},
            'Interview process': {'status': '⚠', 'detail': 'Not clearly mentioned'},
            'Job description': {'status': '⚠', 'detail': 'Not detailed'},
            'Urgency language': {'status': '✅', 'detail': 'No urgency detected'},
            'Professional communication': {'status': '⚠', 'detail': 'Needs review'},
        }
        
        # Update based on indicators
        for indicator in indicators:
            title = indicator['title']
            if 'Payment' in title:
                checks['Payment request']['status'] = '🔴'
                checks['Payment request']['detail'] = 'Payment requested'
            if 'Personal Email' in title:
                checks['Recruiter verification']['status'] = '🔴'
                checks['Recruiter verification']['detail'] = 'Personal email used'
            if 'Official Company Domain' in title:
                checks['Company identity']['status'] = '✅'
                checks['Company identity']['detail'] = 'Company domain verified'
            if 'Detailed Job Description' in title:
                checks['Job description']['status'] = '✅'
                checks['Job description']['detail'] = 'Detailed description provided'
            if 'Interview Process' in title:
                checks['Interview process']['status'] = '✅'
                checks['Interview process']['detail'] = 'Interview process mentioned'
            if 'Urgency' in title:
                checks['Urgency language']['status'] = '🔴'
                checks['Urgency language']['detail'] = 'Urgency tactics detected'
            if 'Official Careers Page' in title:
                checks['Official website']['status'] = '✅'
                checks['Official website']['detail'] = 'Official website detected'
            if 'Poor Grammar' in title:
                checks['Professional communication']['status'] = '🔴'
                checks['Professional communication']['detail'] = 'Poor grammar detected'
            if 'Fake Selection' in title or 'Guaranteed' in title:
                checks['Company identity']['status'] = '🔴'
                checks['Company identity']['detail'] = 'Suspicious selection claim'
        
        return [{'label': k, 'status': v['status'], 'detail': v['detail']} for k, v in checks.items()]
    
    def get_risk_level(self, score: int) -> str:
        """Get risk level based on score"""
        if score <= 29:
            return 'LOW'
        elif score <= 59:
            return 'MEDIUM'
        elif score <= 79:
            return 'HIGH'
        else:
            return 'CRITICAL'
    
    def get_recommendation(self, score: int, risk_level: str) -> str:
        """Generate recommendation based on risk score and level"""
        if risk_level == 'CRITICAL':
            return "🚨 Do not proceed. This opportunity has critical warning signs including payment requests or requests for sensitive information. Avoid making any payments or sharing personal documents. Verify the opportunity directly through the company's official website or contact them through verified channels."
        elif risk_level == 'HIGH':
            return "⚠️ Proceed with caution. Multiple warning signs were detected including suspicious claims or urgency tactics. Independently verify the recruiter, company, and application link before sharing any personal information. If payment is requested, do not proceed."
        elif risk_level == 'MEDIUM':
            return "⚡ Some warning signs were detected. Verify the company and recruiter before proceeding. Check the company's official website, look for the opportunity on their careers page, and contact them through official channels."
        else:
            return "✅ No major warning signals were detected. However, continue to verify the opportunity through official channels. Research the company, check their LinkedIn presence, and ensure the offer comes from a legitimate source."