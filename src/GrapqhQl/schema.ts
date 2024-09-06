type Query {
    contacts(filter: ContactFilter): [Contact!]!
    contact(id: Int!): Contact
    campaigns(status: CampaignStatus): [Campaign!]!
    campaign(id: Int!): Campaign
    templates(category: TemplateCategory): [Template!]!
    template(id: Int!): Template
    workflows(status: WorkflowStatus): [Workflow!]!
    workflow(id: Int!): Workflow
    chatbotFlows: [ChatbotFlow!]!
    chatbotFlow(id: Int!): ChatbotFlow
    analytics(startDate: DateTime!, endDate: DateTime!): Analytics!
  }
  
  type Mutation {
    createContact(input: CreateContactInput!): Contact!
    updateContact(id: Int!, input: UpdateContactInput!): Contact!
    deleteContact(id: Int!): Boolean!
  
    createCampaign(input: CreateCampaignInput!): Campaign!
    updateCampaign(id: Int!, input: UpdateCampaignInput!): Campaign!
    deleteCampaign(id: Int!): Boolean!
  
    createTemplate(input: CreateTemplateInput!): Template!
    updateTemplate(id: Int!, input: UpdateTemplateInput!): Template!
    deleteTemplate(id: Int!): Boolean!
  
    createWorkflow(input: CreateWorkflowInput!): Workflow!
    updateWorkflow(id: Int!, input: UpdateWorkflowInput!): Workflow!
    deleteWorkflow(id: Int!): Boolean!
  
    createChatbotFlow(input: CreateChatbotFlowInput!): ChatbotFlow!
    updateChatbotFlow(id: Int!, input: UpdateChatbotFlowInput!): ChatbotFlow!
    deleteChatbotFlow(id: Int!): Boolean!
  
    sendMessage(input: SendMessageInput!): Message!
  }
  
  type Contact {
    id: Int!
    phoneNumber: String!
    name: String
    email: String
    tags: [Tag!]!
    customFields: JSON
    lastInteraction: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
  }
  
  type Campaign {
    id: Int!
    name: String!
    message: String!
    schedule: DateTime
    status: CampaignStatus!
    performance: JSON
    createdAt: DateTime!
    updatedAt: DateTime!
  }
  
  type Template {
    id: Int!
    name: String!
    content: String!
    status: TemplateStatus!
    category: TemplateCategory!
    language: String!
    performance: JSON
    createdAt: DateTime!
    updatedAt: DateTime!
  }
  
  type Workflow {
    id: Int!
    name: String!
    steps: JSON!
    status: WorkflowStatus!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
  
  type ChatbotFlow {
    id: Int!
    name: String!
    nodes: JSON!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
  
  type Analytics {
    messagesSent: Int!
    messagesDelivered: Int!
    messagesRead: Int!
    campaignsRun: Int!
    engagementRate: Float!
    topPerformingCampaigns: [Campaign!]!
    customerInsights: JSON!
  }
  
  input ContactFilter {
    tags: [String!]
    lastInteractionAfter: DateTime
    lastInteractionBefore: DateTime
  }
  
  input CreateContactInput {
    phoneNumber: String!
    name: String
    email: String
    tags: [String!]
    customFields: JSON
  }
  
  input UpdateContactInput {
    name: String
    email: String
    tags: [String!]
    customFields: JSON
  }
  
  input CreateCampaignInput {
    name: String!
    message: String!
    schedule: DateTime
  }
  
  input UpdateCampaignInput {
    name: String
    message: String
    schedule: DateTime
    status: CampaignStatus
  }
  
  input CreateTemplateInput {
    name: String!
    content: String!
    category: TemplateCategory!
    language: String!
  }
  
  input UpdateTemplateInput {
    name: String
    content: String
    status: TemplateStatus
    category: TemplateCategory
    language: String
  }
  
  input CreateWorkflowInput {
    name: String!
    steps: JSON!
  }
  
  input UpdateWorkflowInput {
    name: String
    steps: JSON
    status: WorkflowStatus
  }
  
  input CreateChatbotFlowInput {
    name: String!
    nodes: JSON!
  }
  
  input UpdateChatbotFlowInput {
    name: String
    nodes: JSON
  }
  
  input SendMessageInput {
    contactId: Int!
    content: String!
  }
  
  enum CampaignStatus {
    DRAFT
    SCHEDULED
    RUNNING
    COMPLETED
    CANCELLED
  }
  
  enum TemplateStatus {
    PENDING
    APPROVED
    REJECTED
  }
  
  enum TemplateCategory {
    MARKETING
    TRANSACTIONAL
    OTP
  }
  
  enum MessageStatus {
    QUEUED
    SENT
    DELIVERED
    READ
    FAILED
  }
  
  enum WorkflowStatus {
    ACTIVE
    PAUSED
    ARCHIVED
  }
  
  scalar DateTime
  scalar JSON