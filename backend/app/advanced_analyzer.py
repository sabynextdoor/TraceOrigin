import re
import json
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
import math

class AdvancedAnalyzer:
    """
    World-class scam detection engine with multi-layered analysis
    """
    
    def __init__(self):
        # Initialize all detection layers
        self.load_patterns()
        self.load_company_database()
        self.load_scam_patterns()
    
    def load_patterns(self):
        """Comprehensive pattern database with weighted scoring"""
        self.patterns = {
            # CRITICAL (35-50 points)
            'critical': {
                'payment_request': {
                    'patterns': [
                        r'pay\s*[₹$€£\d,\.]+\s*(?:fee|amount|money|registration)',
                        r'registration\s*fee\s*[₹$€£\d]',
                        r'processing\s*fee',
                        r'security\s*deposit',
                        r'training\s*fee',
                        r'payment\s*before\s*joining',
                        r'advance\s*payment',
                        r'wallet\s*loading',
                        r'pay\s*(?:us|our|the)\s*(?:company|organization|firm)',
                        r'fee\s*of\s*[₹$€£\d]',
                        r'cost\s*of\s*[₹$€£\d]',
                        r'send\s*[₹$€£\d]+\s*(?:to|for)',
                    ],
                    'weight': 45,
                    'severity': 'CRITICAL',
                    'icon': '💀',
                    'title': '💰 Payment Request',
                    'description': 'This opportunity asks candidates to pay money. Legitimate employers NEVER ask for payment.',
                    'recommendation': '🚨 IMMEDIATELY STOP. This is a classic scam tactic. No legitimate company asks for payment.'
                },
                'otp_request': {
                    'patterns': [
                        r'OTP',
                        r'one[- ]time[- ]password',
                        r'verification\s*code',
                        r'send\s*code',
                        r'share\s*otp',
                    ],
                    'weight': 40,
                    'severity': 'CRITICAL',
                    'icon': '🔐',
                    'title': '🔐 OTP/Code Request',
                    'description': 'Request for OTP or verification codes - this is how accounts get stolen.',
                    'recommendation': '🚨 NEVER share OTPs. This is a sophisticated scam technique.'
                },
                'banking_info': {
                    'patterns': [
                        r'bank\s*(?:account|details|info|number)',
                        r'account\s*number',
                        r'IFSC',
                        r'UPI',
                        r'debit\s*card',
                        r'credit\s*card',
                        r'CVV',
                        r'cvv',
                        r'card\s*number',
                    ],
                    'weight': 40,
                    'severity': 'CRITICAL',
                    'icon': '🏦',
                    'title': '🏦 Banking Details Request',
                    'description': 'Asking for banking information before verification is a major red flag.',
                    'recommendation': '🚨 NEVER share banking details. Legitimate companies use secure HR portals.'
                }
            },
            
            # HIGH (20-35 points)
            'high': {
                'guaranteed_job': {
                    'patterns': [
                        r'guaranteed\s*(?:job|position|placement|selection)',
                        r'100%\s*(?:placement|selection|job)',
                        r'assured\s*(?:job|selection)',
                        r'guarantee\s*(?:job|position)',
                    ],
                    'weight': 30,
                    'severity': 'HIGH',
                    'icon': '🎯',
                    'title': '🎯 Guaranteed Job',
                    'description': 'No legitimate company guarantees a job without an interview process.',
                    'recommendation': '⚠️ This is unrealistic. Always expect a proper interview process.'
                },
                'fake_selection': {
                    'patterns': [
                        r'congratulat[a-z]*\s*(?:you|your)\s*(?:are|have)\s*selected',
                        r'selected\s*for\s*(?:internship|program|position)',
                        r'you\s*(?:are|have)\s*shortlisted',
                        r'pre[- ]selected',
                        r'you\s*won',
                        r'lucky\s*winner',
                    ],
                    'weight': 28,
                    'severity': 'HIGH',
                    'icon': '🏆',
                    'title': '🏆 Fake Selection',
                    'description': 'Claims you are selected without any application or interview process.',
                    'recommendation': '⚠️ Verify through official channels. This is a common scam tactic.'
                },
                'urgency': {
                    'patterns': [
                        r'offer\s*expires\s*(?:today|tomorrow|soon|immediately)',
                        r'limited\s*(?:seats|positions|slots|spots)',
                        r'act\s*(?:now|immediately|fast|quickly)',
                        r'hurry\s*up',
                        r'last\s*chance',
                        r'only\s*[0-9]+\s*(?:seats|spots|positions)',
                        r'urgent',
                        r'immediate\s*(?:action|response)',
                    ],
                    'weight': 25,
                    'severity': 'HIGH',
                    'icon': '⏰',
                    'title': '⏰ Urgency Pressure',
                    'description': 'High-pressure tactics to make you act without thinking.',
                    'recommendation': '⚠️ Take your time. Legitimate opportunities don\'t pressure you.'
                },
                'unrealistic_offer': {
                    'patterns': [
                        r'[₹$€£]\s*[0-9,]+[0-9]{4,}\s*(?:per\s*(?:month|year|annum))',
                        r'lakhs?\s*(?:per\s*(?:month|year))',
                        r'high\s*salary',
                        r'work\s*from\s*home.*[₹$€£]\s*[0-9,]+',
                        r'earn\s*[₹$€£]\s*[0-9,]+\s*(?:per|monthly)',
                    ],
                    'weight': 22,
                    'severity': 'HIGH',
                    'icon': '💰',
                    'title': '💰 Unrealistic Compensation',
                    'description': 'Salary or benefits that seem too good to be true.',
                    'recommendation': '⚠️ Research market rates. This is often a bait tactic.'
                }
            },
            
            # MEDIUM (10-20 points)
            'medium': {
                'personal_email': {
                    'patterns': [
                        r'@gmail\.com',
                        r'@yahoo\.com',
                        r'@outlook\.com',
                        r'@hotmail\.com',
                        r'@rediffmail\.com',
                        r'@protonmail\.com',
                        r'@mail\.com',
                    ],
                    'weight': 15,
                    'severity': 'MEDIUM',
                    'icon': '📧',
                    'title': '📧 Personal Email Domain',
                    'description': 'Using free email services instead of company domain.',
                    'recommendation': '⚠️ Verify the company\'s official domain. Legitimate companies use their own domains.'
                },
                'whatsapp_telegram': {
                    'patterns': [
                        r'whatsapp',
                        r'telegram',
                        r'WhatsApp',
                        r'Telegram',
                        r'WA',
                    ],
                    'weight': 12,
                    'severity': 'MEDIUM',
                    'icon': '💬',
                    'title': '💬 Messaging App Only',
                    'description': 'Communication only through WhatsApp/Telegram is suspicious.',
                    'recommendation': '⚠️ Legitimate companies use official channels, not just messaging apps.'
                },
                'suspicious_url': {
                    'patterns': [
                        r'bit\.ly',
                        r'tinyurl\.com',
                        r'goo\.gl',
                        r'ow\.ly',
                        r'[a-z0-9-]+\.(?:xyz|click|top|club|online|live|site)',
                        r'[a-z0-9-]+\.tk',
                        r'[a-z0-9-]+\.ml',
                    ],
                    'weight': 14,
                    'severity': 'MEDIUM',
                    'icon': '🔗',
                    'title': '🔗 Suspicious URL',
                    'description': 'Shortened or unusual domain names are risky.',
                    'recommendation': '⚠️ Don\'t click suspicious links. Check the actual URL carefully.'
                },
                'poor_grammar': {
                    'patterns': [
                        r'\b(?:ur|u|r)\b',
                        r'\b(?:pls|plz|pl0x)\b',
                        r'\b(?:thx|thanx|tnx)\b',
                        r'[a-z]{20,}',
                        r'!!+',
                        r'\?\?+',
                        r'!!!!',
                    ],
                    'weight': 10,
                    'severity': 'MEDIUM',
                    'icon': '📝',
                    'title': '📝 Poor Quality Writing',
                    'description': 'Professional companies send well-written communications.',
                    'recommendation': '⚠️ Poor grammar and excessive emojis are common in scam messages.'
                },
                'no_interview': {
                    'patterns': [
                        r'no\s*(?:interview|technical\s*round)',
                        r'direct\s*selection',
                        r'without\s*(?:any|an)\s*interview',
                        r'skip\s*interview',
                        r'no\s*(?:interview|technical)\s*required',
                    ],
                    'weight': 12,
                    'severity': 'MEDIUM',
                    'icon': '❌',
                    'title': '❌ No Interview Process',
                    'description': 'Legitimate companies always have a selection process.',
                    'recommendation': '⚠️ Any opportunity without an interview is highly suspicious.'
                }
            },
            
            # LOW (5-10 points)
            'low': {
                'vague_description': {
                    'patterns': [
                        r'work\s*from\s*home.*opportunity',
                        r'flexible\s*hours',
                        r'part\s*time',
                        r'remote\s*work',
                        r'earn\s*extra',
                        r'make\s*money\s*online',
                    ],
                    'weight': 7,
                    'severity': 'LOW',
                    'icon': '📄',
                    'title': '📄 Vague Description',
                    'description': 'The opportunity lacks specific details about the role.',
                    'recommendation': 'ℹ️ Request a detailed job description before proceeding.'
                },
                'missing_company': {
                    'patterns': [
                        r'no\s*company\s*name',
                        r'unknown\s*company',
                        r'company\s*name\s*not\s*provided',
                    ],
                    'weight': 8,
                    'severity': 'LOW',
                    'icon': '🏢',
                    'title': '🏢 No Company Information',
                    'description': 'The company name or details are not clearly mentioned.',
                    'recommendation': 'ℹ️ Always research the company before applying.'
                }
            },
            
            # POSITIVE SIGNALS (-5 to -15 points)
            'positive': {
                'company_domain': {
                    'patterns': [
                        r'@[a-z0-9-]+\.(?:com|org|in|io|ai|dev|co)',
                        r'@[a-z0-9-]+\.(?:company|enterprise)',
                    ],
                    'weight': -10,
                    'severity': 'POSITIVE',
                    'icon': '✅',
                    'title': '✅ Official Domain',
                    'description': 'Communication from official company domain.',
                    'recommendation': '✅ Good sign! Continue with verification.'
                },
                'detailed_description': {
                    'patterns': [
                        r'responsibilities?\s*:',
                        r'requirements?\s*:',
                        r'qualifications?\s*:',
                        r'skills\s*(?:required|needed)',
                        r'about\s*the\s*role',
                        r'job\s*description',
                        r'key\s*responsibilities',
                    ],
                    'weight': -8,
                    'severity': 'POSITIVE',
                    'icon': '✅',
                    'title': '✅ Detailed Description',
                    'description': 'Comprehensive job description provided.',
                    'recommendation': '✅ Good sign of a professional opportunity.'
                },
                'interview_process': {
                    'patterns': [
                        r'interview\s*(?:process|round|schedule)',
                        r'technical\s*(?:interview|round|assessment)',
                        r'coding\s*(?:test|challenge|assessment)',
                        r'round\s*[0-9]',
                        r'hr\s*round',
                        r'managerial\s*round',
                        r'selection\s*process',
                    ],
                    'weight': -8,
                    'severity': 'POSITIVE',
                    'icon': '✅',
                    'title': '✅ Structured Interview Process',
                    'description': 'Clear interview process mentioned.',
                    'recommendation': '✅ This is a sign of a legitimate company.'
                },
                'official_careers': {
                    'patterns': [
                        r'careers\.[a-z0-9-]+\.(?:com|org|in)',
                        r'careers\s*page',
                        r'apply\s*through\s*(?:our|the)\s*(?:website|portal|careers)',
                        r'official\s*application',
                        r'apply\s*online',
                    ],
                    'weight': -7,
                    'severity': 'POSITIVE',
                    'icon': '✅',
                    'title': '✅ Official Application Portal',
                    'description': 'Apply through official company website.',
                    'recommendation': '✅ Apply through official channels only.'
                },
                'no_payment_mention': {
                    'patterns': [
                        r'no\s*payment\s*(?:required|needed|asked)',
                        r'free\s*(?:to|of)\s*cost',
                        r'no\s*fee',
                        r'no\s*charges',
                        r'free\s*internship',
                    ],
                    'weight': -12,
                    'severity': 'POSITIVE',
                    'icon': '✅',
                    'title': '✅ No Payment Required',
                    'description': 'Clearly states no payment is required.',
                    'recommendation': '✅ This is a very good sign!'
                }
            }
        }
    
    def load_company_database(self):
        """Known legitimate and scam companies"""
        self.company_db = {
            'legitimate': [
                'google', 'microsoft', 'amazon', 'apple', 'facebook', 'meta', 
                'netflix', 'uber', 'airbnb', 'salesforce', 'oracle', 'ibm', 
                'cisco', 'adobe', 'intel', 'nvidia', 'amd', 'spotify', 
                'twitter', 'linkedin', 'github', 'gitlab', 'stripe', 'square',
                'zoom', 'slack', 'atlassian', 'jpmorgan', 'goldman', 'morgan',
                'tcs', 'infosys', 'wipro', 'hcl', 'tech mahindra', 'accenture',
                'deloitte', 'pwc', 'ey', 'kpmg', 'capgemini', 'cognizant'
            ],
            'known_scams': [
                'easy money', 'quick cash', 'job guarantee', 'work from home scam',
                'make money online', 'passive income', 'get rich quick'
            ],
            'suspicious': [
                'global', 'international', 'worldwide', 'unlimited', 
                'extra income', 'side hustle'
            ]
        }
    
    def load_scam_patterns(self):
        """Advanced scam pattern detection"""
        self.scam_patterns = {
            'emotional_manipulation': [
                r'exclusive', r'limited', r'rare', r'once in a lifetime',
                r'opportunity of a lifetime', r'golden chance', r'never miss'
            ],
            'authority_figures': [
                r'ceo', r'director', r'chairman', r'founder', r'president',
                r'vice president', r'svp', r'evp'
            ],
            'urgency_phrases': [
                r'immediately', r'asap', r'urgent', r'today only',
                r'last chance', r'deadline', r'expires', r'limited time'
            ],
            'trust_building': [
                r'trusted', r'reliable', r'verified', r'legitimate',
                r'official', r'authorized', r'accredited'
            ]
        }
    
    def analyze(self, text: str) -> Tuple[int, List[Dict], List[Dict], Dict]:
        """
        Complete analysis with advanced detection
        Returns: (risk_score, indicators, verification, metadata)
        """
        indicators = []
        verification_items = []
        risk_score = 0
        metadata = {
            'word_count': len(text.split()),
            'char_count': len(text),
            'sentence_count': len(re.findall(r'[.!?]+', text)),
            'detected_signals': [],
            'company_identified': None,
            'sentiment': 'neutral'
        }
        
        # Check all pattern categories
        for category, patterns in self.patterns.items():
            for key, config in patterns.items():
                evidence = self._find_patterns(text, config['patterns'])
                if evidence:
                    risk_score += config['weight']
                    indicator = {
                        'severity': config['severity'],
                        'icon': config['icon'],
                        'title': config['title'],
                        'description': config['description'],
                        'evidence': evidence[:250] + '...' if len(evidence) > 250 else evidence,
                        'recommendation': config['recommendation']
                    }
                    indicators.append(indicator)
                    metadata['detected_signals'].append(key)
        
        # Check for known companies
        company_found = self._check_company(text)
        if company_found:
            metadata['company_identified'] = company_found
            
        # Check for scam patterns (bonus detection)
        scam_bonus = self._check_scam_patterns(text)
        risk_score += scam_bonus
        
        # Calculate confidence score
        confidence = self._calculate_confidence(indicators, len(text))
        metadata['confidence'] = confidence
        
        # Build verification checklist
        verification_items = self._build_verification(text, indicators)
        
        # Apply risk score modifiers
        risk_score = self._apply_modifiers(risk_score, indicators, text)
        
        # Ensure score is within 0-100
        risk_score = max(0, min(100, risk_score))
        
        # Add confidence to first indicator if exists
        if indicators:
            indicators[0]['confidence'] = f"{confidence}%"
        
        return risk_score, indicators, verification_items, metadata
    
    def _find_patterns(self, text: str, patterns: List[str]) -> Optional[str]:
        """Find matching patterns with context"""
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                start = max(0, match.start() - 60)
                end = min(len(text), match.end() + 60)
                context = text[start:end]
                return context.strip()
        return None
    
    def _check_company(self, text: str) -> Optional[Dict]:
        """Check for known companies in text"""
        text_lower = text.lower()
        
        # Check legitimate companies
        for company in self.company_db['legitimate']:
            if company in text_lower:
                return {
                    'name': company,
                    'type': 'legitimate',
                    'confidence': 'high'
                }
        
        # Check known scams
        for scam in self.company_db['known_scams']:
            if scam in text_lower:
                return {
                    'name': scam,
                    'type': 'known_scam',
                    'confidence': 'high'
                }
        
        # Check suspicious terms
        for term in self.company_db['suspicious']:
            if term in text_lower:
                return {
                    'name': term,
                    'type': 'suspicious',
                    'confidence': 'medium'
                }
        
        return None
    
    def _check_scam_patterns(self, text: str) -> int:
        """Check for advanced scam patterns"""
        bonus = 0
        text_lower = text.lower()
        
        for category, patterns in self.scam_patterns.items():
            for pattern in patterns:
                if pattern in text_lower:
                    bonus += 3  # Small bonus for each detection
                    break
        
        return min(bonus, 15)  # Cap bonus at 15 points
    
    def _calculate_confidence(self, indicators: List[Dict], text_length: int) -> int:
        """Calculate confidence score based on detection quality"""
        if not indicators:
            return 0
        
        # More indicators = higher confidence
        indicator_confidence = min(len(indicators) * 5, 60)
        
        # More text = more reliable analysis
        text_confidence = min(text_length // 50, 40)
        
        return min(indicator_confidence + text_confidence, 100)
    
    def _apply_modifiers(self, score: int, indicators: List[Dict], text: str) -> int:
        """Apply modifiers to risk score"""
        # Critical signals multiply risk
        critical_count = sum(1 for i in indicators if i['severity'] == 'CRITICAL')
        if critical_count > 0:
            score = int(score * (1 + (critical_count * 0.15)))
        
        # Positive signals reduce risk
        positive_count = sum(1 for i in indicators if i['severity'] == 'POSITIVE')
        if positive_count > 0:
            score = int(score * (1 - (positive_count * 0.05)))
        
        # Check if text mentions "no payment" clearly
        if re.search(r'no\s*(?:payment|fee|charges|cost)', text, re.IGNORECASE):
            score = int(score * 0.85)  # Reduce by 15%
        
        return score
    
    def _build_verification(self, text: str, indicators: List[Dict]) -> List[Dict]:
        """Build comprehensive verification checklist"""
        checks = {
            'Company Identity': {'status': '⚠️', 'detail': 'Verify company registration'},
            'Recruiter Verification': {'status': '⚠️', 'detail': 'Check recruiter credentials'},
            'Payment Security': {'status': '✅', 'detail': 'No payment required'},
            'Official Application': {'status': '⚠️', 'detail': 'Verify application portal'},
            'Interview Process': {'status': '⚠️', 'detail': 'Check interview structure'},
            'Role Legitimacy': {'status': '⚠️', 'detail': 'Verify role exists'},
            'Compensation Check': {'status': '⚠️', 'detail': 'Verify salary range'},
            'Contact Verification': {'status': '⚠️', 'detail': 'Check contact details'},
            'Website Authenticity': {'status': '⚠️', 'detail': 'Verify website legitimacy'},
            'Privacy Policy': {'status': '⚠️', 'detail': 'Check privacy policy'}
        }
        
        # Update based on detected indicators
        for indicator in indicators:
            title = indicator['title']
            
            if 'Payment' in title:
                checks['Payment Security']['status'] = '🔴'
                checks['Payment Security']['detail'] = '⚠️ Payment requested - SCAM ALERT'
            elif 'No Payment' in title:
                checks['Payment Security']['status'] = '✅'
                checks['Payment Security']['detail'] = '✓ No payment required - Good'
            
            if 'Personal Email' in title:
                checks['Recruiter Verification']['status'] = '🔴'
                checks['Recruiter Verification']['detail'] = '⚠️ Using personal email'
            
            if 'Official Domain' in title:
                checks['Company Identity']['status'] = '✅'
                checks['Company Identity']['detail'] = '✓ Company domain verified'
            
            if 'Detailed Description' in title:
                checks['Role Legitimacy']['status'] = '✅'
                checks['Role Legitimacy']['detail'] = '✓ Detailed role description'
            
            if 'Interview Process' in title:
                checks['Interview Process']['status'] = '✅'
                checks['Interview Process']['detail'] = '✓ Structured interview process'
            
            if 'Official Application' in title:
                checks['Official Application']['status'] = '✅'
                checks['Official Application']['detail'] = '✓ Official application portal'
            
            if 'Urgency' in title:
                checks['Contact Verification']['status'] = '🔴'
                checks['Contact Verification']['detail'] = '⚠️ Urgency pressure detected'
            
            if 'Suspicious URL' in title:
                checks['Website Authenticity']['status'] = '🔴'
                checks['Website Authenticity']['detail'] = '⚠️ Suspicious URL detected'
            
            if 'WhatsApp' in title or 'Telegram' in title:
                checks['Contact Verification']['status'] = '🔴'
                checks['Contact Verification']['detail'] = '⚠️ Messaging app only'
        
        return [{'label': k, 'status': v['status'], 'detail': v['detail']} for k, v in checks.items()]
    
    def get_risk_level(self, score: int) -> str:
        """Get risk level with descriptive labels"""
        if score <= 20:
            return 'LOW'
        elif score <= 40:
            return 'MEDIUM'
        elif score <= 60:
            return 'HIGH'
        else:
            return 'CRITICAL'
    
    def get_recommendation(self, score: int, risk_level: str, metadata: Dict) -> str:
        """Generate detailed recommendation"""
        recommendations = {
            'CRITICAL': """🚨 **DO NOT PROCEED** - Multiple Critical Warning Signs Detected!

This opportunity shows clear signs of a sophisticated scam. 

⚠️ **Immediate Actions:**
1. DO NOT make any payments
2. DO NOT share personal or banking information
3. DO NOT click on any suspicious links
4. Block and report the contact
5. Report to cybercrime authorities

🔍 **Verify through:**
- Visit the company's official website directly
- Check LinkedIn for the recruiter
- Search for scam reports about this opportunity

Remember: Legitimate companies NEVER ask for payment for jobs or internships.""",

            'HIGH': """⚠️ **Proceed with Extreme Caution**

Multiple warning signs detected. This opportunity requires thorough verification.

📋 **Verification Checklist:**
- [ ] Verify company through official website
- [ ] Check recruiter's LinkedIn profile
- [ ] Confirm application through official portal
- [ ] Look for reviews from past interns
- [ ] Check if payment is mentioned anywhere

🔍 **Research Steps:**
1. Search: "[Company Name] scam" or "[Company Name] review"
2. Check Glassdoor/AmbitionBox for employee reviews
3. Verify the company's registration status
4. Contact the company through official channels only

⚠️ **Red Flags to Watch:**
- Any mention of payment
- Pressure to act quickly
- Unprofessional communication
- Missing interview process""",

            'MEDIUM': """⚡ **Proceed with Caution**

Some warning signs detected. Take time to verify thoroughly.

📋 **Recommended Actions:**
1. Research the company thoroughly
2. Verify the recruiter's identity
3. Check official website for job posting
4. Ask for detailed job description
5. Request formal interview process

🔍 **Verification Steps:**
- Search company on LinkedIn
- Check if the role exists on their careers page
- Look for employee testimonials
- Verify the contact details provided

💡 **Trust Your Instincts:**
If something feels off, it probably is. Take your time and verify everything.""",

            'LOW': """✅ **Good Signals Detected**

This opportunity appears legitimate based on our analysis.

📋 **Final Verification:**
- [ ] Visit official company website
- [ ] Check LinkedIn presence
- [ ] Verify through Glassdoor
- [ ] Confirm interview process
- [ ] Review offer details carefully

💡 **Best Practices:**
- Always apply through official channels
- Keep a record of all communications
- Never share sensitive information
- Trust your instincts

Remember: Even legitimate opportunities should be verified thoroughly."""
        }
        
        return recommendations.get(risk_level, "Please verify the opportunity through official channels.")