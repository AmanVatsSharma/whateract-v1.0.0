import { beforeEach, describe, expect, it, vi } from "vitest";

const proxyGraphql = vi.fn();

vi.mock("@/services/bff/backend-proxy", () => ({
  proxyGraphql,
}));

vi.mock("@/services/bff/graphql-queries", () => ({
  CAMPAIGNS_BFF_QUERY: "query Campaigns { campaigns { id name status type } }",
  CREATE_CAMPAIGN_BFF_MUTATION: "mutation CreateCampaign { createCampaign(input: $input) { id } }",
  UPDATE_CAMPAIGN_BFF_MUTATION: "mutation UpdateCampaign { updateCampaign(campaignId: $campaignId, input: $input) { id } }",
  DUPLICATE_CAMPAIGN_BFF_MUTATION: "mutation DuplicateCampaign { duplicateCampaign(campaignId: $campaignId) { id } }",
  SET_CAMPAIGN_STATUS_BFF_MUTATION: "mutation SetCampaignStatus { setCampaignStatus(campaignId: $campaignId, status: $status) { id } }",
  DELETE_CAMPAIGN_BFF_MUTATION: "mutation DeleteCampaign { deleteCampaign(campaignId: $campaignId) }",
}));

describe("campaigns route", () => {
  beforeEach(() => {
    vi.resetModules();
    proxyGraphql.mockReset();
  });

  it("returns campaign data from GraphQL proxy", async () => {
    proxyGraphql.mockResolvedValue({
      campaigns: [
        {
          id: "campaign-1",
          name: "Welcome drip",
          status: "ACTIVE",
          type: "BROADCAST",
        },
      ],
    });

    const { GET } = await import("./route");
    const request = new Request("http://localhost/api/campaigns");
    const response = await GET(request);
    const body = (await response.json()) as {
      data: Array<{ id: string; name: string; status: string; type: string }>;
    };

    expect(proxyGraphql).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
    expect(body.data).toHaveLength(1);
    expect(body.data[0]).toMatchObject({
      id: "campaign-1",
      name: "Welcome drip",
      status: "ACTIVE",
      type: "BROADCAST",
    });
  });

  it("returns 502 response when proxy call fails", async () => {
    proxyGraphql.mockRejectedValue(new Error("GraphQL unavailable"));

    const { GET } = await import("./route");
    const response = await GET(new Request("http://localhost/api/campaigns"));
    const body = (await response.json()) as { error: string };

    expect(response.status).toBe(502);
    expect(body.error).toContain("GraphQL unavailable");
  });

  it("creates campaign with composition and targeting payload", async () => {
    proxyGraphql.mockResolvedValue({
      createCampaign: {
        id: "campaign-create-1",
        name: "Launch blast",
      },
    });

    const { POST } = await import("./route");
    const response = await POST(
      new Request("http://localhost/api/campaigns", {
        method: "POST",
        body: JSON.stringify({
          name: "Launch blast",
          type: "BROADCAST",
          messageBody: "Welcome to launch",
          audienceContactIds: ["contact-1", "contact-2"],
        }),
      }),
    );
    const body = (await response.json()) as { data: { id: string } };

    expect(response.status).toBe(200);
    expect(proxyGraphql).toHaveBeenCalledTimes(1);
    expect(body.data.id).toBe("campaign-create-1");
  });

  it("duplicates campaign when duplicate action is provided", async () => {
    proxyGraphql.mockResolvedValue({
      duplicateCampaign: {
        id: "campaign-copy-1",
      },
    });

    const { POST } = await import("./route");
    const response = await POST(
      new Request("http://localhost/api/campaigns", {
        method: "POST",
        body: JSON.stringify({
          action: "duplicate",
          campaignId: "campaign-1",
          newName: "Campaign Copy",
        }),
      }),
    );
    const body = (await response.json()) as { data: { id: string } };

    expect(response.status).toBe(200);
    expect(body.data.id).toBe("campaign-copy-1");
  });

  it("updates campaign via PUT route", async () => {
    proxyGraphql.mockResolvedValue({
      updateCampaign: {
        id: "campaign-1",
      },
    });

    const { PUT } = await import("./route");
    const response = await PUT(
      new Request("http://localhost/api/campaigns", {
        method: "PUT",
        body: JSON.stringify({
          campaignId: "campaign-1",
          name: "Updated",
          templateName: "welcome_template",
        }),
      }),
    );
    const body = (await response.json()) as { data: { id: string } };

    expect(response.status).toBe(200);
    expect(body.data.id).toBe("campaign-1");
  });

  it("returns 400 on PUT without campaignId", async () => {
    const { PUT } = await import("./route");
    const response = await PUT(
      new Request("http://localhost/api/campaigns", {
        method: "PUT",
        body: JSON.stringify({ name: "Missing id" }),
      }),
    );

    expect(response.status).toBe(400);
  });
});
