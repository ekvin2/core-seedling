import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Edit, Trash2, Plus, HelpCircle } from 'lucide-react';

interface FAQ {
  id: string;
  service_id?: string | null;
  question: string;
  answer: string;
  display_order?: number;
  is_general: boolean;
  is_active: boolean;
  created_at: string;
}

interface ServiceFAQManagerProps {
  serviceId: string;
  serviceName: string;
}

export const ServiceFAQManager: React.FC<ServiceFAQManagerProps> = ({ serviceId, serviceName }) => {
  const { toast } = useToast();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  
  // Form state
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  // Confirmation dialog state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmFaqId, setConfirmFaqId] = useState<string | null>(null);

  useEffect(() => {
    fetchFaqs();
  }, [serviceId]);

  const fetchFaqs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('service_id', serviceId)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      toast({
        title: "Error fetching FAQs",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setFaqs(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setQuestion('');
    setAnswer('');
    setEditingFaq(null);
  };

  const handleOpenModal = (faq?: FAQ) => {
    if (faq) {
      setEditingFaq(faq);
      setQuestion(faq.question);
      setAnswer(faq.answer);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const faqData = {
      question,
      answer,
      service_id: serviceId,
      is_general: false,
      is_active: true,
    };

    let error;
    if (editingFaq) {
      const { error: updateError } = await supabase
        .from('faqs')
        .update(faqData)
        .eq('id', editingFaq.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('faqs')
        .insert([faqData]);
      error = insertError;
    }

    if (error) {
      toast({
        title: "Error saving FAQ",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `FAQ ${editingFaq ? 'updated' : 'created'} successfully!`,
      });
      handleCloseModal();
      fetchFaqs();
    }
    setLoading(false);
  };

  const handleDelete = (id: string) => {
    setConfirmFaqId(id);
    setIsConfirmOpen(true);
  };

  const performDeleteConfirmed = async () => {
    if (!confirmFaqId) return;

    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', confirmFaqId);

    if (error) {
      toast({
        title: "Error deleting FAQ",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "FAQ deleted successfully!",
      });
      fetchFaqs();
    }

    setIsConfirmOpen(false);
    setConfirmFaqId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Service FAQs</h3>
          <p className="text-sm text-muted-foreground">
            Manage FAQs specific to {serviceName}
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add FAQ
        </Button>
      </div>

      {loading && faqs.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">Loading FAQs...</div>
      ) : faqs.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-muted p-4 mb-3">
                <HelpCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h4 className="font-medium mb-1">No FAQs yet</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Add your first FAQ for this service
              </p>
              <Button onClick={() => handleOpenModal()} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add FAQ
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Question</TableHead>
                <TableHead className="w-[45%]">Answer</TableHead>
                <TableHead className="text-right w-[15%]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faqs.map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell className="font-medium">
                    <div className="line-clamp-2">{faq.question}</div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="line-clamp-2">{faq.answer}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenModal(faq)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(faq.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* FAQ Edit/Create Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingFaq ? 'Edit FAQ' : 'Add FAQ'}</DialogTitle>
            <DialogDescription>
              {editingFaq ? 'Update the FAQ details.' : 'Create a new FAQ for this service.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. How long does the service take?"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter the answer..."
                className="min-h-[120px]"
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (editingFaq ? 'Update' : 'Create')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={isConfirmOpen}
        title="Delete FAQ?"
        description="This will permanently delete this FAQ. This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={performDeleteConfirmed}
        onCancel={() => { setIsConfirmOpen(false); setConfirmFaqId(null); }}
      />
    </div>
  );
};
