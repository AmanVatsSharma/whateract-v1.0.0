"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  acceptTeamInvite,
  createTeam,
  inviteTeamMember,
  listTeamMembers,
} from "@/features/team/services/team.service";

type TeamMember = {
  id: string;
  teamName?: string;
  userEmail?: string;
  role: string;
  status: string;
  joinedAt?: string | null;
};

export default function TeamPage() {
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [teamId, setTeamId] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"OWNER" | "ADMIN" | "MARKETER" | "AGENT" | "VIEWER">("MARKETER");
  const [inviteToken, setInviteToken] = useState("");
  const [acceptUserId, setAcceptUserId] = useState("");
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshMembers = useCallback(async (targetTeamId?: string) => {
    try {
      const data = await listTeamMembers(targetTeamId || teamId || undefined);
      setMembers(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load team members");
    }
  }, [teamId]);

  useEffect(() => {
    void refreshMembers();
  }, [refreshMembers]);

  const handleCreateTeam = async () => {
    try {
      setIsLoading(true);
      const team = await createTeam({
        name: teamName,
        description: teamDescription || undefined,
      });
      if (team?.id) {
        setTeamId(team.id);
      }
      toast.success("Team created");
      await refreshMembers(team?.id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create team");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvite = async () => {
    try {
      setIsLoading(true);
      const invite = await inviteTeamMember({
        teamId,
        email: inviteEmail,
        role: inviteRole,
      });
      if (invite?.token) {
        setInviteToken(invite.token);
      }
      toast.success("Team invite created");
      await refreshMembers(teamId);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to invite member");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptInvite = async () => {
    try {
      setIsLoading(true);
      await acceptTeamInvite({ token: inviteToken, userId: acceptUserId });
      toast.success("Invite accepted");
      await refreshMembers(teamId);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to accept invite");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Team Onboarding</h1>
        <p className="text-muted-foreground">
          Create teams, invite members, and track collaborator access.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Team</CardTitle>
          <CardDescription>Initialize a team for your workspace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="teamName">Team name</Label>
            <Input
              id="teamName"
              value={teamName}
              onChange={(event) => setTeamName(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="teamDescription">Description</Label>
            <Input
              id="teamDescription"
              value={teamDescription}
              onChange={(event) => setTeamDescription(event.target.value)}
            />
          </div>
          <Button disabled={isLoading || !teamName} onClick={handleCreateTeam}>
            Create team
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invite Member</CardTitle>
          <CardDescription>Send role-based invite to a collaborator.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="teamId">Team id</Label>
            <Input
              id="teamId"
              value={teamId}
              onChange={(event) => setTeamId(event.target.value)}
              placeholder="team uuid"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inviteEmail">Member email</Label>
            <Input
              id="inviteEmail"
              type="email"
              value={inviteEmail}
              onChange={(event) => setInviteEmail(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as typeof inviteRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OWNER">Owner</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="MARKETER">Marketer</SelectItem>
                <SelectItem value="AGENT">Agent</SelectItem>
                <SelectItem value="VIEWER">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            disabled={isLoading || !teamId || !inviteEmail}
            onClick={handleInvite}
          >
            Invite member
          </Button>
          {inviteToken && (
            <div className="text-sm text-muted-foreground">
              Latest invite token: <span className="font-mono text-foreground">{inviteToken}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accept Invite</CardTitle>
          <CardDescription>Complete invite acceptance manually for testing.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inviteToken">Invite token</Label>
            <Input
              id="inviteToken"
              value={inviteToken}
              onChange={(event) => setInviteToken(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="acceptUserId">User id</Label>
            <Input
              id="acceptUserId"
              value={acceptUserId}
              onChange={(event) => setAcceptUserId(event.target.value)}
            />
          </div>
          <Button
            disabled={isLoading || !inviteToken || !acceptUserId}
            onClick={handleAcceptInvite}
          >
            Accept invite
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Current members retrieved from backend.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-3">
            <Button variant="outline" onClick={() => refreshMembers(teamId)} disabled={isLoading}>
              Refresh members
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.teamName || "-"}</TableCell>
                  <TableCell>{member.userEmail || member.id}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>{member.status}</TableCell>
                  <TableCell>{member.joinedAt || "-"}</TableCell>
                </TableRow>
              ))}
              {!members.length && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No members found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
