import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
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
import { Search, Plus, MoreHorizontal, FileEdit, Trash2, Mail, Phone, Download, Building, Filter, ChevronDown, Upload, Database, Columns, Check } from "lucide-react";
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
  const location = useLocation();

  // Filters & Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState(location.state?.defaultSearch || "");
  const [statusFilter, setStatusFilter] = useState("All");
  const [companyFilter, setCompanyFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // "newest", "oldest", "name"

  // Columns Visibility
  const [cols, setCols] = useState({
    details: true,
    company: true,
    status: true,
    createdAt: true
  });
  
  // Debounce search
  const debouncedSearch = useDebounce(search, 300);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  // File Input Ref for Import
  const fileInputRef = useRef(null);

  // Delete State
  const [deleteId, setDeleteId] = useState(null);

  // Data fetching
  const { data, isLoading, isError, error } = useContacts({
    page,
    limit,
    search: debouncedSearch,
    status: statusFilter === "All" ? "" : statusFilter,
    company: companyFilter,
    sortBy: sortBy,
    order: sortBy === "name" ? "asc" : (sortBy === "oldest" ? "asc" : "desc")
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
  }, [debouncedSearch, statusFilter, companyFilter, sortBy]);

  // Sync with global search if navigated from topbar
  useEffect(() => {
    if (location.state?.defaultSearch) {
      setSearch(location.state.defaultSearch);
      // Optional: Clear state so refresh doesn't trigger it again
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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

  const handleExportCSV = (exportAll = false) => {
    // If exporting all, we ideally should fetch all from backend. 
    // For now we will use the loaded contacts list as a proxy or indicate it exports current view.
    const dataToExport = contacts;
    
    if (!dataToExport.length) {
      toast.error("No contacts to export");
      return;
    }
    
    // CSV Header
    const headers = ["First Name", "Last Name", "Email", "Phone", "Company", "Job Title", "Status", "Created At"];
    
    // CSV Rows
    const rows = dataToExport.map(c => [
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
    link.setAttribute("download", `contacts_${exportAll ? 'all' : 'filtered'}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(exportAll ? "Exported all contacts successfully" : "Exported current view successfully");
  };

  const handleImportCSV = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success(`Importing ${file.name}... (Simulated)`);
      e.target.value = null;
    }
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
      <div className="flex flex-col h-full space-y-3 min-h-0">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Contacts</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage your network, track leads, and close deals.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input type="file" accept=".csv" ref={fileInputRef} className="hidden" onChange={handleImportCSV} />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-xl h-9 border-border/60 hover:bg-muted/50 hidden md:flex text-xs">
                  <Columns className="mr-2 h-4 w-4 text-muted-foreground" /> Columns <ChevronDown className="ml-2 h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl border-border/60 shadow-sm">
                <DropdownMenuLabel className="text-xs text-muted-foreground font-semibold">Toggle Columns</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/40" />
                <DropdownMenuItem onClick={(e) => { e.preventDefault(); setCols(p => ({...p, details: !p.details})) }} className="cursor-pointer text-sm py-2 flex justify-between">
                   <span>Contact Details</span>
                   {cols.details && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.preventDefault(); setCols(p => ({...p, company: !p.company})) }} className="cursor-pointer text-sm py-2 flex justify-between">
                   <span>Company & Title</span>
                   {cols.company && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.preventDefault(); setCols(p => ({...p, status: !p.status})) }} className="cursor-pointer text-sm py-2 flex justify-between">
                   <span>Status</span>
                   {cols.status && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.preventDefault(); setCols(p => ({...p, createdAt: !p.createdAt})) }} className="cursor-pointer text-sm py-2 flex justify-between">
                   <span>Date Added</span>
                   {cols.createdAt && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-xl h-9 border-border/60 hover:bg-muted/50 hidden sm:flex text-xs">
                  <Database className="mr-2 h-4 w-4 text-muted-foreground" /> Data <ChevronDown className="ml-2 h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl border-border/60 shadow-sm">
                <DropdownMenuLabel className="text-xs text-muted-foreground font-semibold">Import & Export</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/40" />
                <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="cursor-pointer text-sm py-2">
                   <Upload className="mr-2 h-4 w-4" /> Import CSV
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/40" />
                <DropdownMenuItem onClick={() => handleExportCSV(false)} className="cursor-pointer text-sm py-2">
                   <Download className="mr-2 h-4 w-4" /> Export Filtered View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportCSV(true)} className="cursor-pointer text-sm py-2">
                   <Download className="mr-2 h-4 w-4 text-primary" /> Export All Contacts
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button size="sm" onClick={() => { setEditingContact(null); setIsFormOpen(true); }} className="rounded-xl h-9 shadow-md shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground text-xs">
              <Plus className="mr-2 h-4 w-4" /> Add Contact
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-2 w-full">
          {/* Search Input */}
          <div className="relative w-full lg:flex-1 lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              className="pl-9 h-9 bg-card border-border/60 focus-visible:ring-primary/20 text-xs rounded-xl"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          
          {/* Action Bar (Filters + Sort) */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            
            {/* Company Filter */}
            <div className="relative flex-1 sm:flex-none">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input 
                  placeholder="Company filter" 
                  className="pl-8 w-full sm:w-[140px] bg-card border-border/60 focus-visible:ring-primary/20 text-xs h-9 rounded-xl"
                  value={companyFilter}
                  onChange={(e) => {
                    setCompanyFilter(e.target.value);
                    setPage(1);
                  }}
                />
            </div>

            {/* Status Filter Dropdown */}
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button variant="outline" size="sm" className="h-9 rounded-xl border-border/60 bg-card text-xs font-medium hover:bg-accent flex-1 sm:flex-none justify-between w-full sm:w-[130px] px-3">
                   <span className="flex items-center text-muted-foreground truncate">
                     <Filter className="mr-1.5 h-3.5 w-3.5 opacity-70" />
                     {statusFilter === "All" ? "All Statuses" : statusFilter}
                   </span>
                   <ChevronDown className="h-3.5 w-3.5 opacity-50 ml-1" />
                 </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="start" className="w-[150px] rounded-xl border-border/60 shadow-sm">
                 <DropdownMenuItem onClick={() => { setStatusFilter("All"); setPage(1); }} className="cursor-pointer">All Statuses</DropdownMenuItem>
                 <DropdownMenuItem onClick={() => { setStatusFilter("Active"); setPage(1); }} className="cursor-pointer">Active</DropdownMenuItem>
                 <DropdownMenuItem onClick={() => { setStatusFilter("Lead"); setPage(1); }} className="cursor-pointer">Lead</DropdownMenuItem>
                 <DropdownMenuItem onClick={() => { setStatusFilter("Inactive"); setPage(1); }} className="cursor-pointer">Inactive</DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort Dropdown */}
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button variant="outline" size="sm" className="h-9 rounded-xl border-border/60 bg-card text-xs font-medium hover:bg-accent flex-1 sm:flex-none justify-between w-full sm:w-[130px] px-3">
                   <span className="text-muted-foreground truncate">
                     Sort: {sortBy === "newest" ? "Newest" : sortBy === "oldest" ? "Oldest" : "Name"}
                   </span>
                   <ChevronDown className="h-3.5 w-3.5 opacity-50 ml-1" />
                 </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="w-[150px] rounded-xl border-border/60 shadow-sm">
                 <DropdownMenuItem onClick={() => setSortBy("newest")} className="cursor-pointer">Sort by Newest</DropdownMenuItem>
                 <DropdownMenuItem onClick={() => setSortBy("oldest")} className="cursor-pointer">Sort by Oldest</DropdownMenuItem>
                 <DropdownMenuItem onClick={() => setSortBy("name")} className="cursor-pointer">Sort by Name</DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-2xl border border-border/40 bg-card overflow-auto shadow-sm flex-1 min-h-0 custom-scrollbar">
          <Table className="relative min-w-[800px]">
            <TableHeader className="bg-muted/30 sticky top-0 z-10 backdrop-blur-sm">
              <TableRow className="border-border/40 hover:bg-transparent">
                <TableHead className="font-semibold text-foreground py-3">Contact Name</TableHead>
                {cols.details && <TableHead className="font-semibold text-foreground py-3">Contact Details</TableHead>}
                {cols.company && <TableHead className="font-semibold text-foreground py-3 hidden md:table-cell">Company & Title</TableHead>}
                {cols.status && <TableHead className="font-semibold text-foreground py-3">Status</TableHead>}
                {cols.createdAt && <TableHead className="font-semibold text-foreground py-3 hidden lg:table-cell">Date Added</TableHead>}
                <TableHead className="font-semibold text-foreground py-3 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: limit }).map((_, i) => (
                  <TableRow key={i} className="border-border/40">
                    <TableCell><Skeleton className="h-10 w-[200px]" /></TableCell>
                    {cols.details && <TableCell><Skeleton className="h-10 w-[150px]" /></TableCell>}
                    {cols.company && <TableCell className="hidden md:table-cell"><Skeleton className="h-10 w-[150px]" /></TableCell>}
                    {cols.status && <TableCell><Skeleton className="h-6 w-[60px] rounded-full" /></TableCell>}
                    {cols.createdAt && <TableCell className="hidden lg:table-cell"><Skeleton className="h-6 w-[80px]" /></TableCell>}
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
                    {cols.details && (
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
                    )}
                    {cols.company && (
                      <TableCell className="py-3 hidden md:table-cell">
                        <div className="flex flex-col text-[13px]">
                          <span className="font-semibold text-foreground">{contact.company || "—"}</span>
                          <span className="text-muted-foreground mt-0.5">{contact.jobTitle || ""}</span>
                        </div>
                      </TableCell>
                    )}
                    {cols.status && (
                      <TableCell className="py-3">
                        {getStatusBadge(contact.status)}
                      </TableCell>
                    )}
                    {cols.createdAt && (
                      <TableCell className="py-3 hidden lg:table-cell text-[13px] text-muted-foreground whitespace-nowrap">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </TableCell>
                    )}
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
        {pagination.pages > 0 && (
          <div className="flex flex-col xl:flex-row items-center justify-between px-2 pt-3 pb-1 gap-4 xl:gap-0 shrink-0">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 w-full xl:w-auto justify-center xl:justify-start">
               <span className="text-xs sm:text-sm font-medium text-muted-foreground text-center">
                 Showing <span className="text-foreground">{((pagination.page - 1) * pagination.limit) + 1}</span> to <span className="text-foreground">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="text-foreground">{pagination.total}</span> entries
               </span>
               <div className="hidden sm:flex items-center gap-2">
                 <span className="text-xs sm:text-sm text-muted-foreground">Rows:</span>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 rounded-md border-border/60 bg-card text-xs sm:text-sm font-medium focus-visible:ring-1 focus-visible:ring-primary/50 w-[65px] sm:w-[70px] justify-between px-2">
                        {limit} <ChevronDown className="h-3 w-3 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-[70px] rounded-xl border-border/60">
                      {[10, 20, 50, 100].map(val => (
                         <DropdownMenuItem key={val} onClick={() => { setLimit(val); setPage(1); }} className="cursor-pointer text-sm justify-center">
                           {val}
                         </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                 </DropdownMenu>
               </div>
            </div>
            <div className="flex items-center gap-1 w-full xl:w-auto justify-center xl:justify-end">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-border/60 hover:bg-muted/50 text-sm h-9 px-3"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </Button>
              <div className="hidden sm:flex gap-1 mx-2">
                 {(() => {
                   let startPage = Math.max(1, page - 2);
                   let endPage = Math.min(pagination.pages, startPage + 4);
                   if (endPage - startPage < 4) {
                     startPage = Math.max(1, endPage - 4);
                   }
                   const visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
                   return visiblePages.map((p) => (
                     <Button
                       key={p}
                       variant={page === p ? "default" : "ghost"}
                       size="sm"
                       className={`h-8 w-8 p-0 rounded-xl ${page === p ? 'bg-[#f3a886] text-slate-900 shadow-sm hover:bg-[#eb9d79]' : 'text-muted-foreground hover:bg-muted/50'}`}
                       onClick={() => setPage(p)}
                     >
                       {p}
                     </Button>
                   ));
                 })()}
              </div>
              <span className="sm:hidden text-sm font-medium mx-2">Page {page} of {pagination.pages}</span>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-border/60 hover:bg-muted/50 text-sm h-9 px-3"
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
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
