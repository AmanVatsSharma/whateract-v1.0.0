"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  getShopifyStatus,
  startShopifyOauth,
  syncShopifyCustomers,
  syncShopifyOrders,
  syncShopifyProducts,
} from "@/features/shopify/services/shopify.service";

type ShopifyStatus = {
  connected?: boolean;
  shopDomain?: string | null;
  orders?: number;
  customers?: number;
  products?: number;
  commerceJourneys?: number;
  lastOrdersSyncAt?: string | null;
  lastCustomersSyncAt?: string | null;
  lastProductsSyncAt?: string | null;
};

export default function ShopifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [shopDomain, setShopDomain] = useState("");
  const [status, setStatus] = useState<ShopifyStatus>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const loadStatus = async () => {
    try {
      const data = await getShopifyStatus();
      setStatus(data || {});
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load Shopify status");
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  useEffect(() => {
    const oauthState = searchParams.get("oauth");
    if (!oauthState) {
      return;
    }

    if (oauthState === "success") {
      const connectedShop = searchParams.get("shopDomain");
      toast.success(
        connectedShop
          ? `Shopify connected: ${connectedShop}`
          : "Shopify OAuth connected successfully",
      );
      void loadStatus();
    } else {
      const reason = searchParams.get("reason");
      toast.error(reason ? `Shopify OAuth failed: ${reason}` : "Shopify OAuth failed");
    }

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("oauth");
    nextParams.delete("reason");
    nextParams.delete("shopDomain");
    const nextPath = nextParams.toString()
      ? `/shopify?${nextParams.toString()}`
      : "/shopify";
    router.replace(nextPath);
  }, [router, searchParams]);

  const handleStartOauth = async () => {
    try {
      setIsConnecting(true);
      const payload = await startShopifyOauth(shopDomain);
      window.location.href = payload.authUrl;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Shopify OAuth start failed");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSyncOrders = async () => {
    try {
      setIsLoading(true);
      const result = await syncShopifyOrders(50);
      toast.success(`Orders synced: ${result?.count ?? 0}`);
      await loadStatus();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Order sync failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncCustomers = async () => {
    try {
      setIsLoading(true);
      const result = await syncShopifyCustomers(50);
      toast.success(`Customers synced: ${result?.count ?? 0}`);
      await loadStatus();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Customer sync failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncProducts = async () => {
    try {
      setIsLoading(true);
      const result = await syncShopifyProducts(50);
      toast.success(`Products synced: ${result?.count ?? 0}`);
      await loadStatus();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Product sync failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Shopify Integration</h1>
        <p className="text-muted-foreground">
          Connect your Shopify store and sync orders/customers for campaigns.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connect with Shopify OAuth</CardTitle>
          <CardDescription>
            Start OAuth onboarding for secure token exchange and automated sync setup.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shopDomain">Shop domain</Label>
            <Input
              id="shopDomain"
              placeholder="your-store.myshopify.com"
              value={shopDomain}
              onChange={(event) => setShopDomain(event.target.value)}
            />
          </div>
          <Button
            onClick={handleStartOauth}
            disabled={isLoading || isConnecting || !shopDomain}
          >
            {isConnecting ? "Redirecting to Shopify..." : "Connect with OAuth"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sync Status</CardTitle>
          <CardDescription>Current synced records for this tenant.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm">Connected: {status.connected ? "Yes" : "No"}</div>
          <div className="text-sm">Shop: {status.shopDomain || "-"}</div>
          <div className="text-sm">Orders: {status.orders ?? 0}</div>
          <div className="text-sm">Customers: {status.customers ?? 0}</div>
          <div className="text-sm">Products: {status.products ?? 0}</div>
          <div className="text-sm">Commerce journeys: {status.commerceJourneys ?? 0}</div>
          <div className="text-sm">
            Last order sync: {status.lastOrdersSyncAt || "-"}
          </div>
          <div className="text-sm">
            Last customer sync: {status.lastCustomersSyncAt || "-"}
          </div>
          <div className="text-sm">
            Last product sync: {status.lastProductsSyncAt || "-"}
          </div>
          <Separator />
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleSyncOrders} disabled={isLoading || !status.connected}>
              Sync orders
            </Button>
            <Button onClick={handleSyncCustomers} disabled={isLoading || !status.connected}>
              Sync customers
            </Button>
            <Button onClick={handleSyncProducts} disabled={isLoading || !status.connected}>
              Sync products
            </Button>
            <Button variant="outline" onClick={loadStatus} disabled={isLoading}>
              Refresh status
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
