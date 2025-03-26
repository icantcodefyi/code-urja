import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';

interface EmailTemplateProps {
  candidateName: string;
  positionName: string;
  companyName: string;
  assessmentId: string;
  assessmentDate: string;
  dashboardLink: string;
  overallScore?: number;
  skillScore?: number;
  experienceScore?: number;
  intentScore?: number;
  strengths?: string[];
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  candidateName = 'Candidate',
  positionName = 'Open Position',
  companyName = 'TalentAI',
  assessmentId = 'ASM-12345',
  assessmentDate = new Date().toLocaleDateString(),
  dashboardLink = 'https://example.com/dashboard',
  overallScore = 85,
  skillScore = 80,
  experienceScore = 90,
  intentScore = 85,
  strengths = ['Communication', 'Problem Solving', 'Technical Knowledge'],
}) => {
  return (
    <Html>
      <Head />
      <Preview>
        Assessment Completed: {positionName} application for {candidateName}
      </Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto my-[48px] p-[40px] bg-white rounded-[8px] shadow-sm max-w-[600px]">
            {/* Header */}
            <Section>
              <Heading className="text-[22px] font-bold text-gray-900 m-0">
                Assessment Analysis Complete
              </Heading>
              <Text className="text-[16px] text-gray-700 mt-[8px] mb-[32px]">
                {positionName} • {companyName}
              </Text>
            </Section>
            
            <Hr className="border-t border-gray-200 my-[32px]" />
            
            {/* Main Content */}
            <Section>
              <Text className="text-[16px] text-gray-700 my-[16px]">
                Hello HR Team,
              </Text>
              <Text className="text-[16px] text-gray-700 my-[16px] leading-[24px]">
                We've completed the AI analysis for <strong>{candidateName}</strong>'s application for the <strong>{positionName}</strong> position. The assessment included video, audio, and text responses along with resume analysis.
              </Text>
              
              {/* Assessment Overview */}
              <Section className="my-[32px] bg-blue-50 p-[24px] rounded-[8px] border-l-[3px] border-blue-500">
                <Heading className="text-[16px] font-bold text-gray-900 m-0">
                  Candidate Assessment Overview
                </Heading>
                <Text className="text-[15px] text-gray-700 mt-[16px] mb-[8px] leading-[22px]">
                  <strong>Overall Score:</strong> {overallScore}%
                </Text>
                <Text className="text-[15px] text-gray-700 mt-[8px] mb-[8px] leading-[22px]">
                  <strong>Skill Match:</strong> {skillScore}%
                </Text>
                <Text className="text-[15px] text-gray-700 mt-[8px] mb-[8px] leading-[22px]">
                  <strong>Experience Level:</strong> {experienceScore}%
                </Text>
                <Text className="text-[15px] text-gray-700 mt-[8px] mb-[8px] leading-[22px]">
                  <strong>Intent to Join:</strong> {intentScore}%
                </Text>
              </Section>
              
              {/* Candidate Strengths */}
              <Section className="my-[32px] bg-green-50 p-[24px] rounded-[8px] border-l-[3px] border-green-500">
                <Heading className="text-[16px] font-bold text-gray-900 m-0">
                  Candidate Strengths
                </Heading>
                <ul className="pl-[20px] my-[16px]">
                  {strengths.map((strength, index) => (
                    <li key={index} className="text-[15px] text-gray-700 mb-[8px]">{strength}</li>
                  ))}
                </ul>
              </Section>
              
              {/* Dashboard Link */}
              <Section className="my-[32px]">
                <Text className="text-[15px] text-gray-700 mb-[16px] leading-[22px]">
                  View the complete analysis including video/audio responses and transcriptions on your dashboard:
                </Text>
                <Button
                  className="bg-blue-600 text-white font-medium py-[12px] px-[20px] rounded-[4px] no-underline text-[14px] text-center box-border"
                  href={dashboardLink}
                >
                  View Full Assessment
                </Button>
              </Section>
              
              {/* Assessment Details */}
              <Section className="my-[32px] bg-gray-50 p-[24px] rounded-[8px]">
                <Text className="text-[14px] text-gray-500 m-0">
                  <strong>Assessment ID:</strong> {assessmentId}
                </Text>
                <Text className="text-[14px] text-gray-500 mt-[8px] mb-0">
                  <strong>Date Completed:</strong> {assessmentDate}
                </Text>
              </Section>
              
              <Text className="text-[16px] text-gray-700 mt-[32px] mb-0">
                Regards,
              </Text>
              <Text className="text-[16px] font-medium text-gray-900 mt-[4px] mb-0">
                {companyName} AI Assessment Platform
              </Text>
            </Section>
            
            <Hr className="border-t border-gray-200 my-[32px]" />
            
            {/* Footer */}
            <Section>
              <Text className="text-[12px] text-gray-500 m-0">
                © {new Date().getFullYear()} {companyName}. All rights reserved.
              </Text>
              <Text className="text-[12px] text-gray-500 mt-[16px] mb-0">
                <Link href="#" className="text-gray-500 underline">
                  Privacy Policy
                </Link>{' '}
                •{' '}
                <Link href="#" className="text-gray-500 underline">
                  Terms of Service
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailTemplate;