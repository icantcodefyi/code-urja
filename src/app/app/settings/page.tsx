"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import { Separator } from "~/components/ui/separator";
import { Label } from "~/components/ui/label";
import {
  Save,
  Building,
  Mail,
  BellRing,
  User,
  Trash2,
  Shield,
  Globe,
  AlertTriangle,
} from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import { signOut } from "next-auth/react";

interface HRProfile {
  id: string;
  companyName: string;
  companyLogo?: string;
  companyWebsite?: string;
  companyDescription?: string;
  userId: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: "HR" | "ADMIN" | "CANDIDATE";
}

interface NotificationSettings {
  assessmentCompleted: boolean;
  newResponseSubmitted: boolean;
  assessmentReminders: boolean;
  marketingEmails: boolean;
}

export default function SettingsPage() {
  // Company profile
  const [hrProfile, setHrProfile] = useState<HRProfile | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");

  // User profile
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // Notification settings
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      assessmentCompleted: true,
      newResponseSubmitted: true,
      assessmentReminders: false,
      marketingEmails: false,
    });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeSaveSection, setActiveSaveSection] = useState<
    "account" | "company" | "notifications" | null
  >(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Fetch HR profile
        const hrResponse = await fetch("/api/settings/hr-profile");
        if (hrResponse.ok) {
          const hrData = (await hrResponse.json()) as { profile: HRProfile };
          setHrProfile(hrData.profile);
          setCompanyName(hrData.profile.companyName ?? "");
          setCompanyWebsite(hrData.profile.companyWebsite ?? "");
          setCompanyDescription(hrData.profile.companyDescription ?? "");
        }

        // Fetch user profile
        const userResponse = await fetch("/api/settings/user-profile");
        if (userResponse.ok) {
          const userData = (await userResponse.json()) as { user: UserProfile };
          setUserProfile(userData.user);
          setUserName(userData.user.name ?? "");
          setUserEmail(userData.user.email ?? "");
        }

        // Fetch notification settings
        const notifResponse = await fetch("/api/settings/notifications");
        if (notifResponse.ok) {
          const notifData = (await notifResponse.json()) as {
            settings: NotificationSettings;
          };
          setNotificationSettings(notifData.settings);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchSettings();
  }, []);

  const saveCompanyProfile = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setActiveSaveSection("company");

    try {
      // In a real app, you would submit to the API
      const payload = {
        companyName,
        companyWebsite,
        companyDescription,
      };

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Saving company profile:", payload);
      setSaveSuccess(true);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
        setActiveSaveSection(null);
      }, 3000);
    } catch (error) {
      console.error("Error saving company profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const saveUserProfile = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setActiveSaveSection("account");

    try {
      // In a real app, you would submit to the API
      const payload = {
        name: userName,
        email: userEmail,
      };

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Saving user profile:", payload);
      setSaveSuccess(true);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
        setActiveSaveSection(null);
      }, 3000);
    } catch (error) {
      console.error("Error saving user profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const saveNotificationSettings = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setActiveSaveSection("notifications");

    try {
      // In a real app, you would submit to the API
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Saving notification settings:", notificationSettings);
      setSaveSuccess(true);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
        setActiveSaveSection(null);
      }, 3000);
    } catch (error) {
      console.error("Error saving notification settings:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure your account and assessment platform
        </p>
      </div>

      <div className="space-y-10">
        {/* Account Information Section */}
        <section>
          <h2 className="mb-4 flex items-center text-xl font-semibold">
            <User className="mr-2 h-5 w-5" />
            Account Information
          </h2>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>
                Manage your personal account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div>
                      <Skeleton className="mb-2 h-9 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="userName">Name</Label>
                    <Skeleton className="h-10 w-full" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="userEmail">Email</Label>
                    <Skeleton className="h-10 w-full" />
                  </div>

                  <Skeleton className="h-20 w-full rounded-md" />
                </>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <div className="bg-muted flex h-20 w-20 items-center justify-center overflow-hidden rounded-full">
                      {userProfile?.image ? (
                        <img
                          src={userProfile.image}
                          alt={userProfile.name ?? "User avatar"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="text-muted-foreground h-10 w-10" />
                      )}
                    </div>
                    <div>
                      <Button variant="outline" className="mb-2">
                        Change Avatar
                      </Button>
                      <p className="text-muted-foreground text-xs">
                        JPG, GIF or PNG. Max size of 2MB.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="userName">Name</Label>
                    <Input
                      id="userName"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="userEmail">Email</Label>
                    <Input
                      id="userEmail"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      type="email"
                    />
                  </div>

                  <div className="bg-muted flex items-center gap-2 rounded-md p-3">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">
                        Account Role: {userProfile?.role}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {userProfile?.role === "ADMIN"
                          ? "You have full administrative access to all features."
                          : "You have HR access to manage assessments and candidates."}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div>
                {saveSuccess && activeSaveSection === "account" && (
                  <p className="text-sm text-green-600">
                    Account information saved successfully!
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={() => {
                    void signOut({
                      redirectTo: "/",
                    });
                  }}
                >
                  Logout
                </Button>
                <Button
                  onClick={saveUserProfile}
                  disabled={
                    loading || (saving && activeSaveSection === "account")
                  }
                >
                  {saving && activeSaveSection === "account" ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </section>

        {/* Company Profile Section */}
        <section>
          <h2 className="mb-4 flex items-center text-xl font-semibold">
            <Building className="mr-2 h-5 w-5" />
            Company Profile
          </h2>

          <Card>
            <CardHeader>
              <CardTitle>Company Details</CardTitle>
              <CardDescription>
                Update your company information and branding for the assessment
                platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Skeleton className="h-10 w-full" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyWebsite">Company Website</Label>
                    <Skeleton className="h-10 w-full" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyDescription">
                      About Your Company
                    </Label>
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>

                  <div className="space-y-2">
                    <Label>Company Logo</Label>
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-24 w-24" />
                      <Skeleton className="h-9 w-28" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Your company name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyWebsite">Company Website</Label>
                    <Input
                      id="companyWebsite"
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      placeholder="https://example.com"
                      type="url"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyDescription">
                      About Your Company
                    </Label>
                    <Textarea
                      id="companyDescription"
                      value={companyDescription}
                      onChange={(e) => setCompanyDescription(e.target.value)}
                      placeholder="Brief description of your company"
                      rows={4}
                    />
                    <p className="text-muted-foreground text-xs">
                      This information will be displayed to candidates when they
                      take your assessments.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Company Logo</Label>
                    <div className="flex items-center gap-4">
                      <div className="bg-muted flex h-24 w-24 items-center justify-center rounded-md border p-4">
                        {hrProfile?.companyLogo ? (
                          <img
                            src={hrProfile.companyLogo}
                            alt="Company Logo"
                            className="max-h-full max-w-full"
                          />
                        ) : (
                          <Building className="text-muted-foreground h-10 w-10" />
                        )}
                      </div>
                      <Button>Upload Logo</Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div>
                {saveSuccess && activeSaveSection === "company" && (
                  <p className="text-sm text-green-600">
                    Company profile saved successfully!
                  </p>
                )}
              </div>
              <Button
                onClick={saveCompanyProfile}
                disabled={
                  loading || (saving && activeSaveSection === "company")
                }
              >
                {saving && activeSaveSection === "company" ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </section>

        {/* Notification Settings Section */}
        <section>
          <h2 className="mb-4 flex items-center text-xl font-semibold">
            <BellRing className="mr-2 h-5 w-5" />
            Notification Preferences
          </h2>

          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Configure when and how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <>
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-4 w-64" />
                          </div>
                          <Skeleton className="h-5 w-10 rounded-full" />
                        </div>
                        {i < 4 && <Separator className="my-4" />}
                      </div>
                    ))}
                  </div>

                  <Skeleton className="h-14 w-full rounded-md" />
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">
                          Assessment Completed
                        </Label>
                        <p className="text-muted-foreground text-sm">
                          Receive notifications when a candidate completes an
                          assessment
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.assessmentCompleted}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            assessmentCompleted: checked,
                          })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">
                          New Response Submitted
                        </Label>
                        <p className="text-muted-foreground text-sm">
                          Get notified when candidates submit new responses
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.newResponseSubmitted}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            newResponseSubmitted: checked,
                          })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">
                          Assessment Reminders
                        </Label>
                        <p className="text-muted-foreground text-sm">
                          Receive reminders about expiring assessments and
                          pending reviews
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.assessmentReminders}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            assessmentReminders: checked,
                          })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Marketing & Updates</Label>
                        <p className="text-muted-foreground text-sm">
                          Get emails about product updates, features, and
                          marketing offers
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.marketingEmails}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            marketingEmails: checked,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="bg-muted flex items-center gap-2 rounded-md p-3">
                    <Mail className="text-muted-foreground h-5 w-5" />
                    <p className="text-muted-foreground text-sm">
                      All notifications will be sent to{" "}
                      <span className="font-medium">{userEmail}</span>
                    </p>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div>
                {saveSuccess && activeSaveSection === "notifications" && (
                  <p className="text-sm text-green-600">
                    Notification preferences saved successfully!
                  </p>
                )}
              </div>
              <Button
                onClick={saveNotificationSettings}
                disabled={
                  loading || (saving && activeSaveSection === "notifications")
                }
              >
                {saving && activeSaveSection === "notifications" ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Preferences
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions for your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-red-600" />
                  <div>
                    <h4 className="font-medium text-red-600">Delete Account</h4>
                    <p className="mb-4 text-sm text-red-600/80">
                      Permanently delete your account and all associated data.
                      This action cannot be undone.
                    </p>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
