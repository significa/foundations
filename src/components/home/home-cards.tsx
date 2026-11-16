import {
  BankIcon,
  CreditCardIcon,
  DotsThreeIcon,
  GithubLogoIcon,
  GoogleLogoIcon,
  LinkIcon,
  MagnifyingGlassIcon,
  ReceiptIcon,
  TrendUpIcon,
  UploadSimpleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { Avatar } from "#/foundations/ui/avatar/avatar.tsx";
import { Badge } from "#/foundations/ui/badge/badge.tsx";
import { Button, IconButton } from "#/foundations/ui/button/button.tsx";
import { Calendar } from "#/foundations/ui/calendar/calendar.tsx";
import { Divider } from "#/foundations/ui/divider/divider.tsx";
import { Field } from "#/foundations/ui/field/field.tsx";
import { FileUpload } from "#/foundations/ui/file-upload/file-upload.tsx";
import { Input } from "#/foundations/ui/input/input.tsx";
import { Menu } from "#/foundations/ui/menu/menu.tsx";
import { NumberInput } from "#/foundations/ui/number-input/number-input.tsx";
import { OTPInput } from "#/foundations/ui/otp-input/otp-input.tsx";
import { Pagination, usePagination } from "#/foundations/ui/pagination/pagination.tsx";
import { Popover } from "#/foundations/ui/popover/popover.tsx";
import { Progress } from "#/foundations/ui/progress/progress.tsx";
import { Radio } from "#/foundations/ui/radio/radio.tsx";
import { SegmentedControl } from "#/foundations/ui/segmented-control/segmented-control.tsx";
import { Select } from "#/foundations/ui/select/select.tsx";
import { Slider } from "#/foundations/ui/slider/slider.tsx";
import { Switch } from "#/foundations/ui/switch/switch.tsx";
import { Table } from "#/foundations/ui/table/table.tsx";
import { Textarea } from "#/foundations/ui/textarea/textarea.tsx";
import { cn } from "#/lib/utils/classnames.ts";

interface CardProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

const Card = ({ title, description, action, className, children }: CardProps) => (
  <section
    className={cn(
      "flex min-w-0 flex-col gap-5 rounded-xl border border-border bg-panel p-6 shadow-panel",
      className,
    )}
  >
    <header className="flex items-start gap-3">
      <div className="min-w-0 flex-1">
        <h3 className="font-heading text-base font-semibold">{title}</h3>
        {description && <p className="text-sm text-foreground-secondary">{description}</p>}
      </div>
      {action}
    </header>
    {children}
  </section>
);

const formatEuros = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(value);

const Bars = ({ values, highlightLast }: { values: number[]; highlightLast?: boolean }) => (
  <div className="flex h-24 items-end gap-1.5" aria-hidden="true">
    {values.map((height, index) => (
      <div
        key={`${height}-${index.toString()}`}
        className={cn(
          "flex-1 rounded-sm bg-foreground/10",
          highlightLast && index === values.length - 1 && "bg-accent",
        )}
        style={{ height: `${height}%` }}
      />
    ))}
  </div>
);

const RevenueCard = () => (
  <Card title="Revenue" description="Last 12 months">
    <div className="flex items-center gap-3">
      <p className="text-3xl font-semibold tracking-tight tabular-nums">{formatEuros(48210)}</p>
      <Badge size="sm" variant="success">
        <TrendUpIcon />
        12.4%
      </Badge>
    </div>
    <Bars values={[38, 44, 41, 52, 47, 58, 61, 55, 66, 72, 68, 80]} highlightLast />
  </Card>
);

const INVOICES = [
  { id: "INV-1042", client: "Lumen Labs", status: "Paid", amount: 4200 },
  { id: "INV-1043", client: "Harbor Studio", status: "Due soon", amount: 1350 },
  { id: "INV-1044", client: "Field & Fern", status: "Overdue", amount: 870 },
  { id: "INV-1045", client: "Orbit Analytics", status: "Draft", amount: 2980 },
  { id: "INV-1046", client: "Kestrel", status: "Paid", amount: 615 },
] as const;

const STATUS_VARIANT = {
  Paid: "success",
  "Due soon": "warning",
  Overdue: "error",
  Draft: "neutral",
} as const;

const InvoicesCard = () => {
  const [page, setPage] = useState(1);
  const pages = usePagination({ page, count: 8, siblingCount: 0 });

  return (
    <Card
      title="Invoices"
      description="38 this quarter"
      action={
        <SegmentedControl defaultValue="all" aria-label="Filter invoices">
          <SegmentedControl.Item value="all">All</SegmentedControl.Item>
          <SegmentedControl.Item value="open">Open</SegmentedControl.Item>
          <SegmentedControl.Item value="paid">Paid</SegmentedControl.Item>
        </SegmentedControl>
      }
    >
      <Input.Group size="sm">
        <Input.Addon>
          <MagnifyingGlassIcon />
        </Input.Addon>
        <Input placeholder="Search invoices" />
      </Input.Group>
      <Table.Container bordered={false}>
        <Table className="whitespace-nowrap">
          <Table.Header>
            <Table.Row>
              <Table.Head>Invoice</Table.Head>
              <Table.Head>Client</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head align="end">Amount</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {INVOICES.map((invoice) => (
              <Table.Row key={invoice.id}>
                <Table.Cell className="font-mono text-sm">{invoice.id}</Table.Cell>
                <Table.Cell>{invoice.client}</Table.Cell>
                <Table.Cell>
                  <Badge size="sm" variant={STATUS_VARIANT[invoice.status]}>
                    {invoice.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell align="end" className="tabular-nums">
                  {formatEuros(invoice.amount)}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Table.Container>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-foreground-secondary">Showing 5 of 38</p>
        <Pagination>
          <Pagination.List className="flex-wrap">
            <Pagination.Item>
              <Pagination.Previous
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              />
            </Pagination.Item>
            {pages.map((item) =>
              item.type === "page" ? (
                <Pagination.Item key={item.key}>
                  <Pagination.Link isActive={item.selected} onClick={() => setPage(item.value)}>
                    {item.value}
                  </Pagination.Link>
                </Pagination.Item>
              ) : (
                <Pagination.Item key={item.key}>
                  <Pagination.Ellipsis />
                </Pagination.Item>
              ),
            )}
            <Pagination.Item>
              <Pagination.Next
                onClick={() => setPage((p) => Math.min(8, p + 1))}
                disabled={page === 8}
              />
            </Pagination.Item>
          </Pagination.List>
        </Pagination>
      </div>
    </Card>
  );
};

const SignUpCard = () => (
  <Card title="Create an account" description="Start with your work email.">
    <div className="grid grid-cols-2 gap-2">
      <Button variant="outline">
        <GithubLogoIcon />
        GitHub
      </Button>
      <Button variant="outline">
        <GoogleLogoIcon />
        Google
      </Button>
    </div>
    <div className="flex items-center gap-3 text-xs text-foreground-secondary uppercase">
      <Divider className="flex-1" />
      or
      <Divider className="flex-1" />
    </div>
    <Field>
      <Field.Label>Email</Field.Label>
      <Field.Control>
        <Input type="email" placeholder="you@company.com" />
      </Field.Control>
    </Field>
    <Field>
      <Field.Label>Password</Field.Label>
      <Field.Control>
        <Input type="password" defaultValue="correct horse" />
      </Field.Control>
      <Field.Description>At least 12 characters.</Field.Description>
    </Field>
    <Button className="w-full">Create account</Button>
  </Card>
);

const PAYMENT_METHODS = [
  { value: "card", label: "Card", icon: CreditCardIcon },
  { value: "bank", label: "Bank", icon: BankIcon },
  { value: "invoice", label: "Invoice", icon: ReceiptIcon },
];

const MONTHS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
const YEARS = ["2026", "2027", "2028", "2029", "2030"];

const PaymentCard = () => (
  <Card title="Payment method" description="Change how you pay for your plan.">
    <div className="grid grid-cols-3 gap-2">
      {PAYMENT_METHODS.map(({ value, label, icon: Icon }) => (
        <label
          key={value}
          className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-border p-3 text-sm font-medium has-checked:border-accent has-checked:bg-accent/5"
        >
          <Icon className="size-5" />
          {label}
          <Radio name="payment-method" value={value} defaultChecked={value === "card"} />
        </label>
      ))}
    </div>
    <Field>
      <Field.Label>Name on card</Field.Label>
      <Field.Control>
        <Input defaultValue="Ana Ribeiro" />
      </Field.Control>
    </Field>
    <Field>
      <Field.Label>Card number</Field.Label>
      <Field.Control>
        <Input inputMode="numeric" placeholder="1234 5678 9012 3456" />
      </Field.Control>
    </Field>
    <div className="grid grid-cols-3 gap-2">
      <Select aria-label="Expiry month" defaultValue="08">
        {MONTHS.map((month) => (
          <option key={month}>{month}</option>
        ))}
      </Select>
      <Select aria-label="Expiry year" defaultValue="2028">
        {YEARS.map((year) => (
          <option key={year}>{year}</option>
        ))}
      </Select>
      <Input aria-label="CVC" placeholder="CVC" inputMode="numeric" />
    </div>
    <Button className="w-full">Continue</Button>
  </Card>
);

const PEOPLE = [
  { name: "Ana Ribeiro", email: "ana@studio.co", role: "owner" },
  { name: "Tomás Silva", email: "tomas@studio.co", role: "editor" },
  { name: "Mia Chen", email: "mia@studio.co", role: "viewer" },
];

const PersonRow = ({ name, email, role }: (typeof PEOPLE)[number]) => (
  <div className="flex items-center gap-3">
    <Avatar label={name} size="sm">
      <Avatar.Fallback>{name}</Avatar.Fallback>
    </Avatar>
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-medium">{name}</p>
      <p className="truncate text-sm text-foreground-secondary">{email}</p>
    </div>
    <Select size="sm" aria-label={`${name}'s role`} defaultValue={role} className="w-28">
      <option value="owner">Owner</option>
      <option value="editor">Editor</option>
      <option value="viewer">Viewer</option>
    </Select>
  </div>
);

const TeamCard = () => (
  <Card title="Team members" description="Invite people to work with you.">
    <div className="flex flex-col gap-4">
      {PEOPLE.map((person) => (
        <PersonRow key={person.email} {...person} />
      ))}
    </div>
  </Card>
);

const ShareCard = () => (
  <Card title="Share this document" description="Anyone with the link can view it.">
    <div className="flex gap-2">
      <Input readOnly value="foundations.app/d/q3-plan" aria-label="Document link" />
      <Button variant="outline" className="shrink-0">
        Copy link
      </Button>
    </div>
    <Divider />
    <p className="text-sm font-medium">People with access</p>
    <div className="flex flex-col gap-4">
      {PEOPLE.slice(0, 2).map((person) => (
        <PersonRow key={person.email} {...person} />
      ))}
    </div>
  </Card>
);

const NOTIFICATIONS = [
  { title: "Comments", description: "When someone replies to you.", on: true },
  { title: "Product updates", description: "New features, once a month.", on: false },
  { title: "Weekly summary", description: "Your team's activity every Monday.", on: true },
];

const NotificationsCard = () => (
  <Card title="Notifications" description="Choose what we email you about.">
    <div className="flex flex-col gap-4">
      {NOTIFICATIONS.map(({ title, description, on }) => (
        <label key={title} className="flex items-center gap-4">
          <span className="flex-1">
            <span className="block text-sm font-medium">{title}</span>
            <span className="block text-sm text-foreground-secondary">{description}</span>
          </span>
          <Switch defaultChecked={on} />
        </label>
      ))}
    </div>
    <Button variant="outline" className="w-full">
      Save preferences
    </Button>
  </Card>
);

const IssueCard = () => (
  <Card title="Report an issue" description="We'll get back to you within a day.">
    <div className="grid grid-cols-2 gap-3">
      <Field>
        <Field.Label>Area</Field.Label>
        <Field.Control>
          <Select defaultValue="billing">
            <option value="billing">Billing</option>
            <option value="account">Account</option>
            <option value="integrations">Integrations</option>
          </Select>
        </Field.Control>
      </Field>
      <Field>
        <Field.Label>Severity</Field.Label>
        <Field.Control>
          <Select defaultValue="medium">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </Field.Control>
      </Field>
    </div>
    <Field>
      <Field.Label>Subject</Field.Label>
      <Field.Control>
        <Input placeholder="What's going on?" />
      </Field.Control>
    </Field>
    <Field invalid>
      <Field.Label>Description</Field.Label>
      <Field.Control>
        <Textarea rows={3} placeholder="Steps to reproduce, what you expected…" />
      </Field.Control>
      <Field.Error>Tell us a little more.</Field.Error>
    </Field>
    <div className="flex justify-end gap-2">
      <Button variant="ghost">Cancel</Button>
      <Button>Submit</Button>
    </div>
  </Card>
);

const SLOTS = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];

const BookingCard = () => {
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState("10:30");

  return (
    <Card title="Studio session" description="90 minutes, up to four people.">
      <div className="flex flex-wrap gap-1.5">
        <Badge size="sm">Natural light</Badge>
        <Badge size="sm">Backdrops</Badge>
      </div>
      <Calendar value={date} onDateChange={setDate} className="w-full" />
      <div className="grid grid-cols-3 gap-2">
        {SLOTS.map((time) => (
          <Button
            key={time}
            variant="outline"
            size="sm"
            aria-pressed={time === slot}
            data-pressed={time === slot || undefined}
            onClick={() => setSlot(time)}
          >
            {time}
          </Button>
        ))}
      </div>
      <Button className="w-full">Book {slot}</Button>
    </Card>
  );
};

const VerifyCard = () => (
  <Card title="Check your email" description="Enter the 6-digit code we sent to ana@studio.co.">
    <OTPInput>
      <OTPInput.Cell />
      <OTPInput.Cell />
      <OTPInput.Cell />
      <OTPInput.Cell />
      <OTPInput.Cell />
      <OTPInput.Cell />
    </OTPInput>
    <Button className="w-full">Verify</Button>
    <p className="text-center text-sm text-foreground-secondary">Didn't get it? Resend in 0:42</p>
  </Card>
);

const PlanCard = () => {
  const [seats, setSeats] = useState(8);

  return (
    <Card title="Your plan" description="Team, billed monthly.">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium">Seats</span>
        <div className="w-36">
          <NumberInput value={seats} onValueChange={setSeats}>
            <NumberInput.Decrement />
            <NumberInput.Field aria-label="Seats" />
            <NumberInput.Increment />
          </NumberInput>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Monthly cost</span>
          <span className="text-foreground-secondary tabular-nums">{formatEuros(seats * 24)}</span>
        </div>
        <Slider min={0} max={100} defaultValue={60}>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumb aria-label="Budget alert" />
        </Slider>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Storage</span>
          <span className="text-foreground-secondary tabular-nums">62 of 100 GB</span>
        </div>
        <Progress value={62} aria-label="Storage used" />
      </div>
    </Card>
  );
};

const UploadCard = () => (
  <Card title="Upload files" description="Attach receipts to this expense.">
    <FileUpload maxFiles={5} maxSize={5_000_000}>
      <FileUpload.Dropzone>
        <UploadSimpleIcon className="size-6 text-foreground-secondary" />
        <div className="text-sm">
          <span className="font-medium">Drop files here</span>{" "}
          <span className="text-foreground-secondary">or</span>{" "}
          <FileUpload.Trigger className="cursor-pointer font-medium text-accent underline-offset-2 hover:underline">
            browse
          </FileUpload.Trigger>
        </div>
        <p className="text-xs text-foreground-secondary">Up to 5 files, 5 MB each</p>
      </FileUpload.Dropzone>
    </FileUpload>
  </Card>
);

const ProfileCard = () => (
  <Card title="Profile" description="How you appear to your team.">
    <Field>
      <Field.Label>Name</Field.Label>
      <Field.Control>
        <Input defaultValue="Ana Ribeiro" />
      </Field.Control>
    </Field>
    <Field invalid>
      <Field.Label>Work email</Field.Label>
      <Field.Control>
        <Input defaultValue="ana@studio" />
      </Field.Control>
      <Field.Error>Enter a full email address.</Field.Error>
    </Field>
    <Field>
      <Field.Label>Timezone</Field.Label>
      <Field.Control>
        <Select defaultValue="lisbon">
          <option value="lisbon">Lisbon (GMT+0)</option>
          <option value="berlin">Berlin (GMT+1)</option>
          <option value="new-york">New York (GMT−5)</option>
        </Select>
      </Field.Control>
    </Field>
    <div className="flex justify-end gap-2">
      <Button variant="outline">Cancel</Button>
      <Button>Save changes</Button>
    </div>
  </Card>
);

const ReportCard = () => (
  <Card
    title="Quarterly report"
    description="Updated 2 hours ago"
    action={
      <div className="flex gap-2">
        <Popover placement="bottom-end">
          <Popover.Trigger asChild>
            <Button variant="outline" size="sm">
              <LinkIcon />
              Share
            </Button>
          </Popover.Trigger>
          <Popover.Content className="flex w-72 flex-col gap-3">
            <div>
              <p className="text-sm font-semibold">Share this report</p>
              <p className="text-sm font-normal text-foreground-secondary">
                Anyone with the link can view it.
              </p>
            </div>
            <Input size="sm" readOnly value="foundations.app/r/q3" aria-label="Report link" />
            <Button size="sm">Copy link</Button>
          </Popover.Content>
        </Popover>
        <Menu placement="bottom-end">
          <Menu.Trigger asChild>
            <IconButton variant="outline" size="sm" aria-label="More actions">
              <DotsThreeIcon />
            </IconButton>
          </Menu.Trigger>
          <Menu.Items>
            <Menu.Item>Rename</Menu.Item>
            <Menu.Item>Duplicate</Menu.Item>
            <Menu.Item>Export as PDF</Menu.Item>
            <Menu.Item disabled>Delete</Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
    }
  >
    <Bars values={[40, 65, 50, 80, 58, 92, 70]} />
  </Card>
);

// Three stacks with one gap everywhere: the invoices span the first two, with two stacks under
// them; the third runs the full height. Cards are placed by measured height so the columns end close
const HomeCards = () => (
  <div className="grid items-start gap-6 lg:grid-cols-3">
    <div className="flex min-w-0 flex-col gap-6 lg:col-span-2">
      <InvoicesCard />
      <div className="grid min-w-0 items-start gap-6 md:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-6">
          <BookingCard />
          <SignUpCard />
          <TeamCard />
        </div>
        <div className="flex min-w-0 flex-col gap-6">
          <PlanCard />
          <ShareCard />
          <PaymentCard />
          <NotificationsCard />
        </div>
      </div>
    </div>
    <div className="flex min-w-0 flex-col gap-6">
      <RevenueCard />
      <VerifyCard />
      <IssueCard />
      <ProfileCard />
      <ReportCard />
      <UploadCard />
    </div>
  </div>
);

export { HomeCards };
