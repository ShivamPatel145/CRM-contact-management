import { useState, useEffect } from "react";
import AppLayout from "../../layouts/AppLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Plus, MoreHorizontal, FileEdit, Trash2, Mail, Phone, Download } from "lucide-react";
import { useContacts, useCreateContact, useUpdateContact, useDeleteContact } from "../../hooks/useContacts";
import { ContactForm } from "./components/ContactForm";
import { toast } from "sonner";

// Helper to debounce search input
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const ContactsListPage = () => {
  // Filters & Pagination State
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  // Delete State
  const [deleteId, setDeleteId] = useState(null);

  // Data fetching
  const { data, isLoading, isError, error } = useContacts({
    page,
    limit: 10,
    search: debouncedSearch,
    status: statusFilter,
  });

  // Mutations
  const { mutate: createContact, isPending: isCreating } = useCreateContact();
  const { mutate: updateContact, isPending: isUpdating } = useUpdateContact();
  const { mutate: deleteContact, isPending: isDeleting } = useDeleteContact();

  const contacts = data?.data || [];
  const pagination = data?.pagination || {};

  // Reset page when search or filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  const handleCreateOrUpdate = (formData) => {
    if (editingContact) {
      updateContact({ id: editingContact._id, data: formData }, {
        onSuccess: () => {
          setIsFormOpen(false);
          setEditingContact(null);
        }
      });
    } else {
      createContact(formData, {
        onSuccess: () => {
          setIsFormOpen(false);
        }
      });
    }
  };

  const handleEditClick = (contact) => {
    setEditingContact(contact);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteContact(deleteId, {
        onSuccess: () => setDeleteId(null)
      });
    }
  };

  const handleExportCSV = () => {
    if (!contacts.length) {
      toast.error("No contacts to export");
      return;
    }
    
    // CSV Header
    const headers = ["First Name", "Last Name", "Email", "Phone", "Company", "Job Title", "Status", "Created At"];
    
    // CSV Rows
    const rows = contacts.map(c => [
      c.firstName || "",
      c.lastName || "",
      c.email || "",
      c.phone || "",
      c.company || "",
      c.jobTitle || "",
      c.status || "",
      new Date(c.createdAt).toLocaleDateString()
    ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(","));
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `contacts_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Export successful");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active": return <Badge variant="success">Active</Badge>;
      case "Inactive": return <Badge variant="secondary">Inactive</Badge>;
      case "Lead": return <Badge variant="warning">Lead</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full space-y-5">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Contacts</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your network, track leads, and close deals.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleExportCSV} className="rounded-xl h-10 border-border/60 hover:bg-muted/50 hidden sm:flex">
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
            <Button onClick={() => { setEditingContact(null); setIsFormOpen(true); }} className="rounded-xl h-10 shadow-md shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" /> Add Contact
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 p-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              className="pl-9 h-10 bg-background border-border/60 rounded-xl focus-visible:ring-primary/20 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="h-10 rounded-xl border border-border/60 bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Lead">Lead</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Data Table */}
        <div className="rounded-2xl border border-border/40 bg-card overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border/40 hover:bg-transparent">
                <TableHead className="font-semibold text-foreground py-3">Contact Name</TableHead>
                <TableHead className="font-semibold text-foreground py-3">Contact Details</TableHead>
                <TableHead className="font-semibold text-foreground py-3 hidden md:table-cell">Company & Title</TableHead>
                <TableHead className="font-semibold text-foreground py-3">Status</TableHead>
                <TableHead className="font-semibold text-foreground py-3 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-border/40">
                    <TableCell><Skeleton className="h-10 w-[200px]" /></TableCell>
                    <TableCell><Skeleton className="h-10 w-[150px]" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-10 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[60px] rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-lg ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-destructive">
                    Failed to load contacts: {error?.message}
                  </TableCell>
                </TableRow>
              ) : contacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No contacts found. {search ? "Try adjusting your filters." : "Add your first contact!"}
                  </TableCell>
                </TableRow>
              ) : (
                contacts.map((contact) => (
                  <TableRow key={contact._id} className="group border-border/40 hover:bg-muted/30 transition-colors">
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 bg-primary/10 border border-primary/20">
                          <AvatarFallback className="bg-transparent text-primary font-bold text-xs">
                            {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm text-foreground">{contact.firstName} {contact.lastName}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex flex-col gap-1.5 text-[13px] text-muted-foreground">
                        {contact.email && (
                          <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-muted-foreground/70" /> {contact.email}</div>
                        )}
                        {contact.phone && (
                          <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted-foreground/70" /> {contact.phone}</div>
                        )}
                        {!contact.email && !contact.phone && <span className="text-muted-foreground/50">—</span>}
                      </div>
                    </TableCell>
                    <TableCell className="py-3 hidden md:table-cell">
                      <div className="flex flex-col text-[13px]">
                        <span className="font-semibold text-foreground">{contact.company || "—"}</span>
                        <span className="text-muted-foreground mt-0.5">{contact.jobTitle || ""}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      {getStatusBadge(contact.status)}
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-background border border-transparent hover:border-border/60 rounded-lg">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4 text-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl shadow-sm border-border/40 w-36">
                          <DropdownMenuLabel className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2 pt-1 pb-2">Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditClick(contact)} className="cursor-pointer rounded-lg mx-1 text-sm font-medium">
                            <FileEdit className="mr-2 h-4 w-4 text-muted-foreground" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-border/40 mx-1 my-1" />
                          <DropdownMenuItem onClick={() => setDeleteId(contact._id)} className="text-destructive cursor-pointer rounded-lg mx-1 mb-1 text-sm font-medium focus:bg-destructive/10 focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-2 pt-2">
            <span className="text-sm font-medium text-muted-foreground">
              Showing <span className="text-foreground">{((pagination.page - 1) * pagination.limit) + 1}</span> to <span className="text-foreground">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="text-foreground">{pagination.total}</span> entries
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-border/60 hover:bg-muted/50 text-sm h-9 px-4"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-border/60 hover:bg-muted/50 text-sm h-9 px-4"
                onClick={() => setPage((p) => p + 1)}
                disabled={page === pagination.pages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Slide-out Form */}
      <ContactForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingContact}
        onSubmit={handleCreateOrUpdate}
        isLoading={isCreating || isUpdating}
      />

      {/* Delete Confirmation Alert */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl border-border/40">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-base text-muted-foreground mt-2">
              This action cannot be undone. This will permanently delete the contact
              and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="rounded-xl h-10 border-border/60" disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction className="rounded-xl h-10" onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete Contact"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default ContactsListPage;
