"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  connectShopifyStore,
  getShopifyStatus,
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
  lastOrdersSyncAt?: string | null;
  lastCustomersSyncAt?: string | null;
  lastProductsSyncAt?: string | null;
};

export default function ShopifyPage() {
  const [shopDomain, setShopDomain] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [scopes, setScopes] = useState("read_orders,read_customers,read_products");
  const [status, setStatus] = useState<ShopifyStatus>({});
  const [isLoading, setIsLoading] = useState(false);

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

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      await connectShopifyStore({
        shopDomain,
        accessToken,
        scopes: scopes
          .split(",")
          .map((scope) => scope.trim())
          .filter(Boolean),
      });
      toast.success("Shopify store connected");
      await loadStatus();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Shopify connection failed");
    } finally {
      setIsLoading(false);
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
          <CardTitle>Connection</CardTitle>
          <CardDescription>Set store domain and access token for API sync.</CardDescription>
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
          <div className="space-y-2">
            <Label htmlFor="accessToken">Access token</Label>
            <Input
              id="accessToken"
              type="password"
              placeholder="shpat_..."
              value={accessToken}
              onChange={(event) => setAccessToken(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="scopes">Scopes (comma-separated)</Label>
            <Input
              id="scopes"
              value={scopes}
              onChange={(event) => setScopes(event.target.value)}
            />
          </div>
          <Button onClick={handleConnect} disabled={isLoading || !shopDomain || !accessToken}>
            {isLoading ? "Connecting..." : "Connect store"}
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
