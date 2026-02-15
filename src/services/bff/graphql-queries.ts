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

export const TENANT_STATS_BFF_QUERY = `
  query TenantStatsBffExport {
    tenantStats {
      totalContacts
      totalConversations
      messagesSent
      messagesInbound
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
