import { Component } from '@angular/core';
import {TableModule} from "primeng/table";

type PersonalInfoUSA = {
  category: string;
  example: string;
  collected: boolean;
}

@Component({
    selector: 'app-privacy',
    imports: [
        TableModule,
    ],
    templateUrl: './privacy.component.html',
    styleUrl: './privacy.component.scss'
})
export class PrivacyComponent {

  protected readonly pageUrl = '/privacy/';

  protected readonly personalInfoUSA: PersonalInfoUSA[] = [
    {
      category: 'A. Identifiers',
      example: 'Contact details, such as real name, alias, postal address, telephone or mobile contact number, unique personal identifier, online identifier, Internet Protocol address, email address, and account name',
      collected: true
    },
    {
      category: 'B. Personal information as defined in the California Customer Records statute',
      example: 'Name, contact information, education, employment, employment history, and financial information',
      collected: true
    },
    {
      category: 'C. Protected classification characteristics under state or federal law',
      example: 'Gender, age, date of birth, race and ethnicity, national origin, marital status, and other demographic data',
      collected: false
    },
    {
      category: 'C. Protected classification characteristics under state or federal law',
      example: 'Gender, age, date of birth, race and ethnicity, national origin, marital status, and other demographic data',
      collected: false
    },
    {
      category: 'D. Commercial information',
      example: 'Transaction information, purchase history, financial details, and payment information',
      collected: false
    },
    {
      category: 'E. Biometric information',
      example: 'Fingerprints and voiceprints',
      collected: false
    },
    {
      category: 'F. Internet or other similar network activity',
      example: 'Browsing history, search history, online behavior, interest data, and interactions with our and other websites, applications, systems, and advertisements',
      collected: false
    },
    {
      category: 'G. Geolocation data',
      example: 'Device location',
      collected: true
    },
    {
      category: 'H. Audio, electronic, sensory, or similar information',
      example: 'Images and audio, video or call recordings created in connection with our business activities',
      collected: false
    },
    {
      category: 'I. Professional or employment-related information',
      example: 'Business contact details in order to provide you our Services at a business level or job title, work history, and professional qualifications if you apply for a job with us',
      collected: false
    },
    {
      category: 'J. Education Information',
      example: 'Student records and directory information',
      collected: false
    },
    {
      category: 'K. Inferences drawn from collected personal information',
      example: 'Inferences drawn from any of the collected personal information listed above to create a profile or summary about, for example, an individual’s preferences and characteristics',
      collected: false
    },
    {
      category: 'L. Sensitive personal Information',
      example: 'Account login information',
      collected: true
    }
  ];
}
