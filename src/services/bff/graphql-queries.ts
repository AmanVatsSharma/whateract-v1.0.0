/**
 * File: src/services/bff/graphql-queries.ts
 * Module: frontend-bff
 * Purpose: Central GraphQL documents used by Next.js BFF route handlers.
 * Author: BharatERP
 * created: 2026-02-15
 */

export const CAMPAIGNS_BFF_QUERY = `
  query CampaignsBffList {
    campaigns {
      id
      name
      status
      type
      scheduledAt
      createdAt
    }
  }
`;

export const CREATE_CAMPAIGN_BFF_MUTATION = `
  mutation CreateCampaignBff($input: CreateCampaignInput!) {
    createCampaign(input: $input) {
      id
      name
      status
      type
      scheduledAt
      createdAt
    }
  }
`;

export const SET_CAMPAIGN_STATUS_BFF_MUTATION = `
  mutation SetCampaignStatusBff($campaignId: String!, $status: CampaignStatus!, $scheduledAt: DateTime) {
    setCampaignStatus(campaignId: $campaignId, status: $status, scheduledAt: $scheduledAt) {
      id
      name
      status
      type
      scheduledAt
      createdAt
    }
  }
`;

export const DELETE_CAMPAIGN_BFF_MUTATION = `
  mutation DeleteCampaignBff($campaignId: String!) {
    deleteCampaign(campaignId: $campaignId)
  }
`;

export const TENANT_STATS_BFF_QUERY = `
  query TenantStatsBffExport {
    tenantStats {
      totalContacts
      totalConversations
      messagesSent
      messagesInbound
      totalCampaigns
      campaignMessagesSent
      campaignMessagesFailed
      campaignReplyRate
    }
  }
`;

export const CAMPAIGN_KPIS_BFF_QUERY = `
  query CampaignKpisBff {
    campaignKpis {
      campaignId
      campaignName
      outboundSent
      outboundFailed
      inboundReplies
      replyRate
    }
  }
`;

export const WHATSAPP_ONBOARDING_FUNNEL_BFF_QUERY = `
  query WhatsAppOnboardingFunnelBff {
    whatsappOnboardingFunnel {
      total
      buckets {
        status
        count
      }
    }
  }
`;

export const LOGIN_BFF_MUTATION = `
  mutation LoginBff($input: LoginInput!) {
    login(input: $input) {
      access_token
      mfaRequired
      challengeId
      challengeExpiresAt
      tenant {
        id
        name
      }
    }
  }
`;

export const REGISTER_AND_LOGIN_BFF_MUTATION = `
  mutation RegisterAndLoginBff($input: SignupInput!) {
    registerAndLogin(input: $input) {
      access_token
      mfaRequired
      challengeId
      challengeExpiresAt
      tenant {
        id
        name
      }
    }
  }
`;

export const CONTACTS_BFF_QUERY = `
  query ContactsBffList {
    contacts {
      id
      phone
      firstName
      lastName
      userId
      createdAt
    }
  }
`;

export const TEMPLATES_BFF_QUERY = `
  query TemplatesBffList {
    templates {
      id
      name
      content
      category
      status
      createdAt
    }
  }
`;

export const AUTOMATIONS_BFF_QUERY = `
  query AutomationsBffList {
    automations {
      id
      type
      enabled
      trigger
      createdAt
    }
  }
`;

export const CREATE_AUTOMATION_BFF_MUTATION = `
  mutation CreateAutomationBff(
    $type: String!,
    $trigger: String,
    $enabled: Boolean,
    $definitionJson: String
  ) {
    createAutomation(
      type: $type,
      trigger: $trigger,
      enabled: $enabled,
      definitionJson: $definitionJson
    ) {
      id
      type
      enabled
      trigger
      createdAt
    }
  }
`;

export const UPDATE_AUTOMATION_BFF_MUTATION = `
  mutation UpdateAutomationBff(
    $automationId: String!,
    $type: String,
    $trigger: String,
    $enabled: Boolean,
    $definitionJson: String
  ) {
    updateAutomation(
      automationId: $automationId,
      type: $type,
      trigger: $trigger,
      enabled: $enabled,
      definitionJson: $definitionJson
    ) {
      id
      type
      enabled
      trigger
      createdAt
    }
  }
`;

export const SET_AUTOMATION_ENABLED_BFF_MUTATION = `
  mutation SetAutomationEnabledBff($automationId: String!, $enabled: Boolean!) {
    setAutomationEnabled(automationId: $automationId, enabled: $enabled) {
      id
      type
      enabled
      trigger
      createdAt
    }
  }
`;

export const DELETE_AUTOMATION_BFF_MUTATION = `
  mutation DeleteAutomationBff($automationId: String!) {
    deleteAutomation(automationId: $automationId)
  }
`;
