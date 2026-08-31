import React, { useState, useEffect } from 'react';
import {
  ParentContact,
  NotificationTemplate,
  NotificationLog,
  SendNotificationPayload,
  AINotificationPrompt,
  WebsiteSettings
} from '../../types.js';
import { api } from '../../api.js';
import {
  Mail,
  Send,
  Users,
  FileText,
  History,
  Sparkles,
  Search,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  Copy,
  Download,
  Upload,
  Phone,
  MessageCircle,
  Clock,
  ShieldCheck,
  Check,
  X,
  Info,
  Server,
  Layers,
  Calendar,
  AlertTriangle
} from 'lucide-react';

interface ParentNotificationSystemProps {
  settings: WebsiteSettings;
  onRefreshStats?: () => void;
}

export const ParentNotificationSystem: React.FC<ParentNotificationSystemProps> = ({
  settings,
  onRefreshStats
}) => {
  const [subTab, setSubTab] = useState<'composer' | 'parents' | 'templates' | 'logs' | 'smtp'>('composer');

  // Parents State
  const [parents, setParents] = useState<ParentContact[]>([]);
  const [parentSearch, setParentSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoadingParents, setIsLoadingParents] = useState(false);

  // Parent Add/Edit Modal
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<ParentContact | null>(null);
  const [parentFormData, setParentFormData] = useState<Partial<ParentContact>>({
    parentName: '',
    studentName: '',
    studentClass: 'Class 1 – 4',
    email: '',
    phone: '',
    whatsapp: '',
    batchTiming: 'Evening Batch (4:00 PM - 5:30 PM)',
    status: 'active',
    notes: ''
  });

  // Bulk Import Modal
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [bulkImportText, setBulkImportText] = useState('');
  const [bulkImportError, setBulkImportError] = useState('');

  // Templates State
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [templateFormData, setTemplateFormData] = useState<Partial<NotificationTemplate>>({
    name: '',
    category: 'General Announcement',
    subject: '',
    body: ''
  });

  // Logs State
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<NotificationLog | null>(null);

  // SMTP Status State
  const [smtpStatus, setSmtpStatus] = useState<{
    isConfigured: boolean;
    host: string;
    port: number;
    fromAddress: string;
    activeParentCount: number;
    totalParentCount: number;
  } | null>(null);
  const [testEmailAddress, setTestEmailAddress] = useState('abulques263@gmail.com');
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const [smtpTestResult, setSmtpTestResult] = useState<{
    success: boolean;
    message: string;
    mode?: string;
  } | null>(null);

  // Composer State
  const [composerSubject, setComposerSubject] = useState('');
  const [composerCategory, setComposerCategory] = useState<
    'Holiday' | 'Test Schedule' | 'Progress Update' | 'Fee Notice' | 'General Announcement' | 'Emergency'
  >('Holiday');
  const [composerBody, setComposerBody] = useState('');
  const [composerTargetGroup, setComposerTargetGroup] = useState<'all' | 'class' | 'selected'>('all');
  const [composerTargetClass, setComposerTargetClass] = useState('Class 1 – 4');
  const [composerSelectedParentIds, setComposerSelectedParentIds] = useState<string[]>([]);
  const [composerSendTestOnly, setComposerSendTestOnly] = useState(false);
  const [composerTestEmail, setComposerTestEmail] = useState('abulques263@gmail.com');
  const [isSending, setIsSending] = useState(false);
  const [sendFeedback, setSendFeedback] = useState<{
    success: boolean;
    message: string;
    log?: NotificationLog;
    isSimulated?: boolean;
  } | null>(null);

  // AI Assistant State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiCategory, setAiCategory] = useState('Holiday');
  const [aiTargetClass, setAiTargetClass] = useState('All Classes (Nursery to Class 8)');
  const [aiTopic, setAiTopic] = useState('Eid-ul-Fitr holiday closure for 3 days and holiday practice homework');
  const [aiTone, setAiTone] = useState('polite and encouraging');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Live Email Preview Modal
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Notification Toast Feedback
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [pData, tData, lData, sData] = await Promise.all([
        api.getParents(),
        api.getNotificationTemplates(),
        api.getNotificationLogs(),
        api.getSmtpStatus()
      ]);
      setParents(pData);
      setTemplates(tData);
      setLogs(lData);
      setSmtpStatus(sData);

      // Preload default template if composer is empty
      if (tData.length > 0 && !composerSubject) {
        setComposerSubject(tData[0].subject);
        setComposerCategory(tData[0].category as any);
        setComposerBody(tData[0].body);
      }
    } catch (err: any) {
      console.error('Failed to load notification system data:', err);
    }
  };

  const loadParents = async () => {
    setIsLoadingParents(true);
    try {
      const data = await api.getParents({
        studentClass: classFilter === 'all' ? undefined : classFilter,
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: parentSearch || undefined
      });
      setParents(data);
    } catch (err: any) {
      showToast('Error loading parents: ' + err.message);
    } finally {
      setIsLoadingParents(false);
    }
  };

  useEffect(() => {
    loadParents();
  }, [classFilter, statusFilter, parentSearch]);

  // Insert merge tag into composer body
  const insertMergeTag = (tag: string) => {
    setComposerBody(prev => prev + ' ' + tag + ' ');
  };

  // Select a template for composer
  const handleApplyTemplate = (tmpl: NotificationTemplate) => {
    setComposerSubject(tmpl.subject);
    setComposerCategory(tmpl.category as any);
    setComposerBody(tmpl.body);
    setSubTab('composer');
    showToast(`Template "${tmpl.name}" loaded into composer!`);
  };

  // AI Notice Generation
  const handleGenerateAiNotice = async () => {
    setIsGeneratingAi(true);
    try {
      const result = await api.generateAiNotificationDraft({
        category: aiCategory,
        targetClass: aiTargetClass,
        topicOrKeyPoints: aiTopic,
        tone: aiTone
      });
      setComposerSubject(result.subject);
      setComposerCategory(aiCategory as any);
      setComposerBody(result.body);
      setIsAiModalOpen(false);
      setSubTab('composer');
      showToast('✨ AI generated announcement drafted and applied to composer!');
    } catch (err: any) {
      showToast('Failed to generate AI notice: ' + err.message);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Dispatch Notification
  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerSubject.trim() || !composerBody.trim()) {
      showToast('Please enter both subject and announcement body.');
      return;
    }

    if (composerTargetGroup === 'selected' && composerSelectedParentIds.length === 0) {
      showToast('Please select at least one parent recipient.');
      return;
    }

    setIsSending(true);
    setSendFeedback(null);

    const payload: SendNotificationPayload = {
      subject: composerSubject.trim(),
      category: composerCategory,
      messageBody: composerBody.trim(),
      targetGroup: composerTargetGroup,
      targetClassName: composerTargetClass,
      selectedParentIds: composerSelectedParentIds,
      sendTestOnly: composerSendTestOnly,
      testEmail: composerTestEmail.trim()
    };

    try {
      const res = await api.sendNotification(payload);
      setSendFeedback({
        success: res.success,
        message: res.message,
        log: res.log,
        isSimulated: res.isSimulated
      });
      showToast(res.message);
      // Reload logs and parents
      const [lData, pData] = await Promise.all([api.getNotificationLogs(), api.getParents()]);
      setLogs(lData);
      setParents(pData);
      if (onRefreshStats) onRefreshStats();
    } catch (err: any) {
      setSendFeedback({
        success: false,
        message: err.message || 'Failed to send notification'
      });
      showToast('Dispatch failed: ' + err.message);
    } finally {
      setIsSending(false);
    }
  };

  // Test SMTP connection
  const handleTestSmtp = async () => {
    if (!testEmailAddress) {
      showToast('Please enter a valid test recipient email.');
      return;
    }
    setIsTestingSmtp(true);
    setSmtpTestResult(null);
    try {
      const res = await api.testSmtp({
        testEmail: testEmailAddress.trim(),
        subject: 'IQRA INSTITUTE - Parent Notification Test Dispatch',
        messageBody: 'This confirms that IQRA INSTITUTE notification system is configured and operating as expected for parent communications.',
        category: 'General Announcement'
      });
      setSmtpTestResult(res);
      showToast(res.message);
    } catch (err: any) {
      setSmtpTestResult({
        success: false,
        message: err.message || 'Failed to send test email'
      });
      showToast('SMTP Test Error: ' + err.message);
    } finally {
      setIsTestingSmtp(false);
    }
  };

  // Save Parent Form (Add or Edit)
  const handleSaveParent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentFormData.parentName || !parentFormData.studentName || !parentFormData.email) {
      showToast('Parent Name, Student Name, and valid Email are required.');
      return;
    }

    try {
      if (editingParent) {
        await api.updateParent(editingParent.id, parentFormData);
        showToast('Parent record updated successfully.');
      } else {
        await api.createParent(parentFormData);
        showToast('New parent added to directory.');
      }
      setIsParentModalOpen(false);
      setEditingParent(null);
      loadParents();
      const sData = await api.getSmtpStatus();
      setSmtpStatus(sData);
      if (onRefreshStats) onRefreshStats();
    } catch (err: any) {
      showToast('Failed to save parent: ' + err.message);
    }
  };

  // Bulk Import Parents
  const handleBulkImport = async () => {
    setBulkImportError('');
    if (!bulkImportText.trim()) {
      setBulkImportError('Please enter parent data in the text area.');
      return;
    }

    try {
      let parsedList: Partial<ParentContact>[] = [];

      // Check if user entered JSON
      if (bulkImportText.trim().startsWith('[') || bulkImportText.trim().startsWith('{')) {
        const rawJson = JSON.parse(bulkImportText);
        parsedList = Array.isArray(rawJson) ? rawJson : [rawJson];
      } else {
        // Parse CSV or TSV line by line: ParentName, StudentName, Class, Email, Phone
        const lines = bulkImportText.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;
          const parts = trimmed.split(/,|\t/);
          if (parts.length >= 3) {
            parsedList.push({
              parentName: parts[0]?.trim() || '',
              studentName: parts[1]?.trim() || '',
              studentClass: parts[2]?.trim() || 'Class 1 – 4',
              email: parts[3]?.trim() || '',
              phone: parts[4]?.trim() || '',
              status: 'active'
            });
          }
        }
      }

      if (parsedList.length === 0) {
        setBulkImportError('No valid records found. Ensure format is: Parent Name, Student Name, Class, Email, Phone');
        return;
      }

      const res = await api.bulkImportParents(parsedList);
      showToast(`Successfully imported ${res.addedCount} parent records!`);
      setIsBulkImportOpen(false);
      setBulkImportText('');
      loadParents();
      const sData = await api.getSmtpStatus();
      setSmtpStatus(sData);
      if (onRefreshStats) onRefreshStats();
    } catch (err: any) {
      setBulkImportError('Import failed: ' + err.message);
    }
  };

  // Delete Parent
  const handleDeleteParent = async (id: string) => {
    if (confirm('Are you sure you want to remove this parent contact?')) {
      try {
        await api.deleteParent(id);
        showToast('Parent contact removed.');
        loadParents();
        const sData = await api.getSmtpStatus();
        setSmtpStatus(sData);
        if (onRefreshStats) onRefreshStats();
      } catch (err: any) {
        showToast('Failed to delete: ' + err.message);
      }
    }
  };

  // Save Template (Add or Edit)
  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateFormData.name || !templateFormData.subject || !templateFormData.body) {
      showToast('Template Name, Subject, and Body are required.');
      return;
    }

    try {
      if (editingTemplate) {
        await api.updateNotificationTemplate(editingTemplate.id, templateFormData);
        showToast('Template updated successfully.');
      } else {
        await api.createNotificationTemplate(templateFormData);
        showToast('New template created.');
      }
      setIsTemplateModalOpen(false);
      setEditingTemplate(null);
      const tData = await api.getNotificationTemplates();
      setTemplates(tData);
    } catch (err: any) {
      showToast('Failed to save template: ' + err.message);
    }
  };

  // Delete Template
  const handleDeleteTemplate = async (id: string) => {
    if (confirm('Delete this template?')) {
      try {
        await api.deleteNotificationTemplate(id);
        showToast('Template deleted.');
        const tData = await api.getNotificationTemplates();
        setTemplates(tData);
      } catch (err: any) {
        showToast('Failed to delete template: ' + err.message);
      }
    }
  };

  // Delete Log Entry
  const handleDeleteLog = async (id: string) => {
    if (confirm('Remove this log record?')) {
      try {
        await api.deleteNotificationLog(id);
        showToast('Notification log deleted.');
        const lData = await api.getNotificationLogs();
        setLogs(lData);
        if (selectedLog?.id === id) setSelectedLog(null);
      } catch (err: any) {
        showToast('Failed to delete log: ' + err.message);
      }
    }
  };

  // Render Sample Rendered Email Body for Preview
  const getRenderedPreview = () => {
    const sampleParent = parents[0] || {
      parentName: 'Mohammad Farooq',
      studentName: 'Zayd Farooq',
      studentClass: 'Class 4',
      email: 'farooq.family@example.com'
    };

    let text = composerBody || 'No announcement message entered yet.';
    text = text
      .replace(/\{\{parent_name\}\}/gi, sampleParent.parentName)
      .replace(/\{\{student_name\}\}/gi, sampleParent.studentName)
      .replace(/\{\{student_class\}\}/gi, sampleParent.studentClass)
      .replace(/\{\{institute_name\}\}/gi, settings.instituteName)
      .replace(
        /\{\{date\}\}/gi,
        new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      )
      .replace(/\{\{phone\}\}/gi, settings.phone)
      .replace(/\{\{whatsapp\}\}/gi, settings.whatsapp);

    return text;
  };

  // Count targeted recipients for live counter
  const getRecipientCount = () => {
    if (composerSendTestOnly) return 1;
    if (composerTargetGroup === 'class') {
      return parents.filter(
        p => p.status === 'active' && p.studentClass.toLowerCase().includes(composerTargetClass.toLowerCase())
      ).length;
    }
    if (composerTargetGroup === 'selected') {
      return composerSelectedParentIds.length;
    }
    return parents.filter(p => p.status === 'active').length;
  };

  return (
    <div id="parent-notification-system" className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-500/30 animate-bounce">
          <Info className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Top Banner & Status Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-6 text-white border border-emerald-500/20 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                IQRA Parent Communication Suite
              </span>
              {smtpStatus?.isConfigured ? (
                <span className="bg-emerald-900/60 text-emerald-300 text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  SMTP Live Connected
                </span>
              ) : (
                <span className="bg-amber-900/60 text-amber-300 text-xs font-semibold px-2 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                  Sandbox Preview Mode
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Parent Notification & Bulk Email Dispatch
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Deliver official holiday updates, conceptual test schedules, learning progress notices, and emergency alerts to parents via email with 1-click merge tags and AI drafting.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="open-ai-notice-draft-btn"
              onClick={() => setIsAiModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              AI Draft Assistant
            </button>
            <button
              id="bulk-import-parents-btn"
              onClick={() => setIsBulkImportOpen(true)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl border border-slate-700 transition flex items-center gap-2"
            >
              <Upload className="w-4 h-4 text-emerald-400" />
              Import Roster
            </button>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-800">
          <button
            id="tab-composer"
            onClick={() => setSubTab('composer')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition ${
              subTab === 'composer'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Send className="w-4 h-4" />
            Send Notification (Composer)
          </button>
          <button
            id="tab-parents"
            onClick={() => setSubTab('parents')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition ${
              subTab === 'parents'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Parent Directory ({parents.length})
          </button>
          <button
            id="tab-templates"
            onClick={() => setSubTab('templates')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition ${
              subTab === 'templates'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            Saved Templates ({templates.length})
          </button>
          <button
            id="tab-logs"
            onClick={() => setSubTab('logs')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition ${
              subTab === 'logs'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            Dispatch Logs ({logs.length})
          </button>
          <button
            id="tab-smtp"
            onClick={() => setSubTab('smtp')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition ${
              subTab === 'smtp'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Server className="w-4 h-4" />
            Email / SMTP Setup
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. COMPOSER SUB-TAB */}
      {/* ========================================================================= */}
      {subTab === 'composer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Composer Form */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <form onSubmit={handleSendNotification} className="space-y-6">
              {/* Category & Template Selector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Notification Category
                  </label>
                  <select
                    id="composer-category-select"
                    value={composerCategory}
                    onChange={e => setComposerCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-medium text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Holiday">🌴 Holiday Announcement</option>
                    <option value="Test Schedule">📝 Concept Test Schedule</option>
                    <option value="Progress Update">📈 Learning Progress Update</option>
                    <option value="Fee Notice">💳 Monthly Fee Notice</option>
                    <option value="General Announcement">📢 General Announcement</option>
                    <option value="Emergency">🚨 Emergency Alert / Weather Closure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Quick Load From Template
                  </label>
                  <select
                    id="composer-template-select"
                    onChange={e => {
                      const found = templates.find(t => t.id === e.target.value);
                      if (found) handleApplyTemplate(found);
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-medium text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      -- Choose a preset template --
                    </option>
                    {templates.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Target Audience Selector */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Target Audience
                  </label>
                  <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                    {getRecipientCount()} Recipient{getRecipientCount() === 1 ? '' : 's'} Selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                      composerTargetGroup === 'all'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="targetGroup"
                      checked={composerTargetGroup === 'all'}
                      onChange={() => setComposerTargetGroup('all')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="text-xs">
                      <div className="font-bold">All Active Parents</div>
                      <div className="text-slate-500 text-[11px]">
                        ({parents.filter(p => p.status === 'active').length} total active)
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                      composerTargetGroup === 'class'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="targetGroup"
                      checked={composerTargetGroup === 'class'}
                      onChange={() => setComposerTargetGroup('class')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="text-xs">
                      <div className="font-bold">Specific Class / Batch</div>
                      <div className="text-slate-500 text-[11px]">Filter by grade level</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                      composerTargetGroup === 'selected'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="targetGroup"
                      checked={composerTargetGroup === 'selected'}
                      onChange={() => setComposerTargetGroup('selected')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="text-xs">
                      <div className="font-bold">Custom Multi-Select</div>
                      <div className="text-slate-500 text-[11px]">Pick individual students</div>
                    </div>
                  </label>
                </div>

                {/* Sub-selectors for Target Audience */}
                {composerTargetGroup === 'class' && (
                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Choose Target Grade / Batch:
                    </label>
                    <select
                      value={composerTargetClass}
                      onChange={e => setComposerTargetClass(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm"
                    >
                      <option value="Nursery">Nursery / KG (Early Years)</option>
                      <option value="Class 1 – 4">Class 1 to 4 (Junior Foundation)</option>
                      <option value="Class 5 – 8">Class 5 to 8 (Senior Foundation)</option>
                    </select>
                  </div>
                )}

                {composerTargetGroup === 'selected' && (
                  <div className="pt-2 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Click to select or unselect parents:</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setComposerSelectedParentIds(parents.map(p => p.id))}
                          className="text-emerald-600 hover:underline font-semibold"
                        >
                          Select All
                        </button>
                        <span>|</span>
                        <button
                          type="button"
                          onClick={() => setComposerSelectedParentIds([])}
                          className="text-slate-500 hover:underline"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    <div className="max-h-48 overflow-y-auto bg-white p-2 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {parents.map(p => {
                        const isChecked = composerSelectedParentIds.includes(p.id);
                        return (
                          <label
                            key={p.id}
                            className={`flex items-center gap-2 p-2 rounded text-xs cursor-pointer border ${
                              isChecked ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium' : 'bg-slate-50 border-transparent text-slate-700'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={e => {
                                if (e.target.checked) {
                                  setComposerSelectedParentIds(prev => [...prev, p.id]);
                                } else {
                                  setComposerSelectedParentIds(prev => prev.filter(id => id !== p.id));
                                }
                              }}
                              className="rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <div className="truncate">
                              <span className="font-bold">{p.studentName}</span>
                              <span className="text-slate-500 ml-1">({p.parentName})</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Subject Line */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Email Subject Line
                </label>
                <input
                  id="composer-subject-input"
                  type="text"
                  required
                  value={composerSubject}
                  onChange={e => setComposerSubject(e.target.value)}
                  placeholder="e.g., Holiday Notice: Eid-ul-Fitr Institute Closure"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold text-base focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Merge Tags Helper Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Message Body (Text with Automatic Personalization)
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Click any tag below to insert into your message:
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-2.5 p-2 bg-slate-100/80 rounded-xl border border-slate-200">
                  {[
                    { tag: '{{parent_name}}', label: 'Parent Name' },
                    { tag: '{{student_name}}', label: 'Student Name' },
                    { tag: '{{student_class}}', label: 'Class / Batch' },
                    { tag: '{{date}}', label: "Today's Date" },
                    { tag: '{{phone}}', label: 'Institute Phone' },
                    { tag: '{{whatsapp}}', label: 'WhatsApp' },
                    { tag: '{{institute_name}}', label: 'Institute Name' }
                  ].map(t => (
                    <button
                      key={t.tag}
                      type="button"
                      onClick={() => insertMergeTag(t.tag)}
                      className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-slate-300 hover:border-emerald-400 rounded-lg text-xs font-mono font-medium transition shadow-xs"
                    >
                      {t.tag} <span className="text-[10px] text-slate-500 font-sans">({t.label})</span>
                    </button>
                  ))}
                </div>

                <textarea
                  id="composer-body-input"
                  required
                  rows={9}
                  value={composerBody}
                  onChange={e => setComposerBody(e.target.value)}
                  placeholder="Dear {{parent_name}},&#10;&#10;We would like to inform you that IQRA INSTITUTE will remain closed on [Date]...&#10;&#10;Warm regards,&#10;IQRA INSTITUTE Faculty Team"
                  className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm font-sans leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Test Email Only Checkbox */}
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={composerSendTestOnly}
                    onChange={e => setComposerSendTestOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-amber-900 block">
                      Send Test Email Only (Safe Preview Mode)
                    </span>
                    <span className="text-[11px] text-amber-700 block">
                      Sends a single test message to your designated address before notifying all parents.
                    </span>
                  </div>
                </label>

                {composerSendTestOnly && (
                  <input
                    type="email"
                    value={composerTestEmail}
                    onChange={e => setComposerTestEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none w-full sm:w-64"
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition flex items-center gap-2 border border-slate-300"
                >
                  <Eye className="w-4 h-4 text-slate-600" />
                  Live Preview Email
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setComposerSubject('');
                      setComposerBody('');
                    }}
                    className="px-4 py-2.5 text-slate-500 hover:text-slate-800 text-sm font-semibold"
                  >
                    Clear Form
                  </button>

                  <button
                    id="submit-send-notifications-btn"
                    type="submit"
                    disabled={isSending}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center gap-2"
                  >
                    {isSending ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Dispatched & Processing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {composerSendTestOnly
                          ? 'Send Single Test Email'
                          : `Dispatch to ${getRecipientCount()} Parent${getRecipientCount() === 1 ? '' : 's'}`}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Delivery Feedback Banner */}
              {sendFeedback && (
                <div
                  className={`p-4 rounded-xl border flex items-start gap-3 ${
                    sendFeedback.success
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}
                >
                  {sendFeedback.success ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold text-sm">{sendFeedback.message}</div>
                    {sendFeedback.isSimulated && (
                      <div className="text-xs text-emerald-700 mt-1">
                        Notice was logged in history with full recipient tracking. (To send real live emails to external parent inboxes, set up your SMTP credentials in Email / SMTP Setup).
                      </div>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Side Panel: Live Quick Preview & Helper Tips */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Live Preview Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-600" />
                  Live Mobile Inbox Preview
                </h3>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Sample: Mohammad Farooq
                </span>
              </div>

              {/* Email Container Frame */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs font-sans space-y-3">
                {/* Header */}
                <div className="bg-slate-900 text-white p-3 rounded-lg text-center">
                  <div className="text-[10px] font-bold tracking-wider uppercase text-emerald-400">
                    Official Notice
                  </div>
                  <div className="font-bold text-sm text-white">{settings.instituteName}</div>
                  <div className="text-[10px] text-slate-300">Nursery to Class 8 • Foundation Learning</div>
                </div>

                {/* Meta Badge */}
                <div className="flex items-center justify-between text-[11px] bg-white p-2 rounded border border-slate-200">
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    {composerCategory}
                  </span>
                  <span className="text-slate-500 font-medium">Zayd Farooq (Class 4)</span>
                </div>

                {/* Subject */}
                <div className="font-bold text-slate-900 text-sm">
                  {composerSubject || 'Notice Subject Placeholder'}
                </div>

                {/* Rendered Body */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-slate-700 text-xs leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
                  {getRenderedPreview()}
                </div>

                {/* Footer */}
                <div className="text-center text-[10px] text-slate-400 pt-1">
                  📞 {settings.phone} | 💬 {settings.whatsapp}
                </div>
              </div>
            </div>

            {/* Communication Guidelines Card */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-200/80 text-emerald-950 space-y-3">
              <h4 className="text-sm font-bold flex items-center gap-2 text-emerald-900">
                <Check className="w-4 h-4 text-emerald-600" />
                Best Practices for Parents
              </h4>
              <ul className="text-xs space-y-2 text-emerald-900/90 leading-normal">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  Always include the student's name using <code className="bg-white px-1 rounded font-mono text-[10px]">{'{{student_name}}'}</code> for higher engagement.
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  For test schedules, announce at least 3 days in advance with clear topics.
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  Holiday notices should highlight home practice habits (30 mins daily).
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  Emergency alerts can be sent instantly to all classes with one click.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. PARENT DIRECTORY SUB-TAB */}
      {/* ========================================================================= */}
      {subTab === 'parents' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={parentSearch}
                  onChange={e => setParentSearch(e.target.value)}
                  placeholder="Search by parent, student, email..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Class Filter */}
              <select
                value={classFilter}
                onChange={e => setClassFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-700"
              >
                <option value="all">All Grades</option>
                <option value="Nursery">Nursery / KG</option>
                <option value="Class 1 – 4">Class 1 to 4</option>
                <option value="Class 5 – 8">Class 5 to 8</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-700"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="add-new-parent-btn"
                onClick={() => {
                  setEditingParent(null);
                  setParentFormData({
                    parentName: '',
                    studentName: '',
                    studentClass: 'Class 1 – 4',
                    email: '',
                    phone: '',
                    whatsapp: '',
                    batchTiming: 'Evening Batch (4:00 PM - 5:30 PM)',
                    status: 'active',
                    notes: ''
                  });
                  setIsParentModalOpen(true);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add Parent Contact
              </button>
            </div>
          </div>

          {/* Parents Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Student & Grade</th>
                  <th className="px-4 py-3">Parent Name</th>
                  <th className="px-4 py-3">Email Address</th>
                  <th className="px-4 py-3">Phone / WhatsApp</th>
                  <th className="px-4 py-3">Batch</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Last Notified</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {isLoadingParents ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-slate-400">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
                      Loading roster...
                    </td>
                  </tr>
                ) : parents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-slate-500">
                      No parent records matching your filters.
                    </td>
                  </tr>
                ) : (
                  parents.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{p.studentName}</div>
                        <div className="text-[11px] text-emerald-700 font-semibold">{p.studentClass}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{p.parentName}</td>
                      <td className="px-4 py-3 font-mono text-slate-600">{p.email}</td>
                      <td className="px-4 py-3">
                        <div className="text-slate-800">{p.phone || '—'}</div>
                        {p.whatsapp && (
                          <div className="text-[10px] text-emerald-600 flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" /> {p.whatsapp}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{p.batchTiming || 'Standard'}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {p.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-[11px]">
                        {p.lastNotifiedAt
                          ? new Date(p.lastNotifiedAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'Never'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setComposerTargetGroup('selected');
                              setComposerSelectedParentIds([p.id]);
                              setSubTab('composer');
                              showToast(`Loaded ${p.parentName} into notification composer.`);
                            }}
                            title="Compose direct email to this parent"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingParent(p);
                              setParentFormData(p);
                              setIsParentModalOpen(true);
                            }}
                            title="Edit Parent details"
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteParent(p.id)}
                            title="Delete Parent"
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SAVED TEMPLATES SUB-TAB */}
      {/* ========================================================================= */}
      {subTab === 'templates' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Reusable Announcement Templates</h3>
              <p className="text-xs text-slate-500">
                Pre-written message templates with dynamic tags for holidays, tests, progress reports, and fee notices.
              </p>
            </div>

            <button
              id="create-template-btn"
              onClick={() => {
                setEditingTemplate(null);
                setTemplateFormData({
                  name: '',
                  category: 'General Announcement',
                  subject: '',
                  body: ''
                });
                setIsTemplateModalOpen(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Create New Template
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map(tmpl => (
              <div
                key={tmpl.id}
                className="bg-slate-50 p-5 rounded-xl border border-slate-200 hover:border-emerald-300 transition space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full">
                      {tmpl.category}
                    </span>
                    {tmpl.isDefault && (
                      <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                        Default
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{tmpl.name}</h4>
                  <div className="text-xs font-semibold text-slate-600 mt-1">
                    Subject: <span className="text-slate-800">{tmpl.subject}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 bg-white p-3 rounded-lg border border-slate-200 line-clamp-4 font-mono leading-relaxed">
                    {tmpl.body}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <button
                    onClick={() => handleApplyTemplate(tmpl)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Use in Composer
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingTemplate(tmpl);
                        setTemplateFormData(tmpl);
                        setIsTemplateModalOpen(true);
                      }}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {!tmpl.isDefault && (
                      <button
                        onClick={() => handleDeleteTemplate(tmpl.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. DISPATCH LOGS SUB-TAB */}
      {/* ========================================================================= */}
      {subTab === 'logs' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Notification Dispatch History</h3>
              <p className="text-xs text-slate-500">
                Detailed record of all parent emails, timestamps, audience targets, and delivery status.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {logs.length === 0 ? (
              <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                <History className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <div className="text-sm font-semibold text-slate-600">No notifications sent yet.</div>
                <div className="text-xs text-slate-400 mt-1">
                  Notifications dispatched from the composer will appear here with full delivery logs.
                </div>
              </div>
            ) : (
              logs.map(log => (
                <div
                  key={log.id}
                  className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full">
                        {log.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.status === 'success'
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.status === 'partial'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {log.status.toUpperCase()}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(log.sentAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">{log.subject}</h4>
                    <div className="text-xs text-slate-600 flex items-center gap-3">
                      <span>
                        Target: <strong>{log.targetGroup === 'all' ? 'All Parents' : log.targetClassName || log.targetGroup}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Recipients: <strong>{log.recipientCount}</strong>
                      </span>
                      <span>•</span>
                      <span className="text-slate-500">{log.smtpSummary}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Recipients & Message
                    </button>
                    <button
                      onClick={() => handleDeleteLog(log.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. EMAIL / SMTP SETUP SUB-TAB */}
      {/* ========================================================================= */}
      {subTab === 'smtp' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Server className="w-5 h-5 text-emerald-600" />
                SMTP Server Status & Live Testing
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Verify connection to your SMTP mail service (e.g., Gmail App Passwords, SendGrid, Amazon SES, Brevo) to deliver live emails.
              </p>
            </div>

            {/* Current Status Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Connection Mode
                </span>
                {smtpStatus?.isConfigured ? (
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Live Production SMTP Configured
                  </span>
                ) : (
                  <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-amber-600" />
                    Simulated Sandbox Mode
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-200">
                <div>
                  <span className="text-slate-500 block">Host / Server:</span>
                  <span className="font-mono font-bold text-slate-800">{smtpStatus?.host}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Port:</span>
                  <span className="font-mono font-bold text-slate-800">{smtpStatus?.port}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block">Sender "From" Address:</span>
                  <span className="font-mono font-bold text-slate-800">{smtpStatus?.fromAddress}</span>
                </div>
              </div>
            </div>

            {/* Test SMTP Form */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-3">
              <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                Send Live Verification Test Email
              </h4>
              <p className="text-xs text-emerald-800">
                Enter your personal or test email to verify that mail leaves the server and arrives cleanly in your inbox:
              </p>

              <div className="flex gap-2">
                <input
                  type="email"
                  value={testEmailAddress}
                  onChange={e => setTestEmailAddress(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-3.5 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  onClick={handleTestSmtp}
                  disabled={isTestingSmtp}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0 shadow-sm"
                >
                  {isTestingSmtp ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Test Now
                    </>
                  )}
                </button>
              </div>

              {smtpTestResult && (
                <div
                  className={`p-3 rounded-lg text-xs font-medium flex items-start gap-2 ${
                    smtpTestResult.success
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-rose-100 text-rose-900 border border-rose-300'
                  }`}
                >
                  {smtpTestResult.success ? (
                    <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                  )}
                  <div>{smtpTestResult.message}</div>
                </div>
              )}
            </div>
          </div>

          {/* Guide for Setting Up Real Credentials */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              How to configure live SMTP in .env
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              To send real emails directly to parent inboxes, declare these environment variables:
            </p>

            <div className="bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-[11px] space-y-1 overflow-x-auto">
              <div className="text-slate-400"># .env configuration</div>
              <div>SMTP_HOST=smtp.gmail.com</div>
              <div>SMTP_PORT=587</div>
              <div>SMTP_USER=abulques263@gmail.com</div>
              <div>SMTP_PASS=your_gmail_16_digit_app_password</div>
              <div>SMTP_FROM="IQRA INSTITUTE" &lt;abulques263@gmail.com&gt;</div>
            </div>

            <div className="text-xs text-slate-600 space-y-2">
              <div className="font-bold text-slate-800">Gmail App Password Instructions:</div>
              <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                <li>Go to Google Account &gt; Security.</li>
                <li>Turn ON 2-Step Verification.</li>
                <li>Search for "App Passwords" and generate a 16-character password for "Mail".</li>
                <li>Paste it in <code className="bg-slate-100 px-1 font-mono">SMTP_PASS</code>.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: AI DRAFT NOTICE ASSISTANT */}
      {/* ========================================================================= */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                AI Parent Notice Generator (Gemini)
              </h3>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Notice Category
                </label>
                <select
                  value={aiCategory}
                  onChange={e => setAiCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                >
                  <option value="Holiday">Holiday Announcement</option>
                  <option value="Test Schedule">Concept Assessment / Test Schedule</option>
                  <option value="Progress Update">Monthly Learning Progress</option>
                  <option value="Fee Notice">Fee Reminder & Receipt Notice</option>
                  <option value="General Announcement">General Institute Announcement</option>
                  <option value="Emergency">Weather Closure / Emergency</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Target Grade
                </label>
                <select
                  value={aiTargetClass}
                  onChange={e => setAiTargetClass(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                >
                  <option value="All Classes (Nursery to Class 8)">All Classes (Nursery to Class 8)</option>
                  <option value="Nursery / KG">Nursery / KG</option>
                  <option value="Class 1 – 4">Class 1 to 4</option>
                  <option value="Class 5 – 8">Class 5 to 8</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Key Points / Details to include
                </label>
                <textarea
                  rows={3}
                  value={aiTopic}
                  onChange={e => setAiTopic(e.target.value)}
                  placeholder="e.g., Closed for Eid-ul-Fitr from Thursday to Saturday. Regular classes resume Monday. Daily math worksheet attached."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Tone
                </label>
                <select
                  value={aiTone}
                  onChange={e => setAiTone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                >
                  <option value="polite, warm, and encouraging">Polite, Warm & Encouraging (Recommended)</option>
                  <option value="formal and authoritative">Formal & Official</option>
                  <option value="urgent and clear">Urgent & Clear (For closures)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerateAiNotice}
                disabled={isGeneratingAi}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
              >
                {isGeneratingAi ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating with Gemini...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    Generate & Apply Draft
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT PARENT CONTACT */}
      {/* ========================================================================= */}
      {isParentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                {editingParent ? 'Edit Parent Contact' : 'Add Parent Contact'}
              </h3>
              <button
                onClick={() => setIsParentModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveParent} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={parentFormData.studentName || ''}
                    onChange={e => setParentFormData({ ...parentFormData, studentName: e.target.value })}
                    placeholder="Zayd Farooq"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Enrolled Class *
                  </label>
                  <select
                    value={parentFormData.studentClass || 'Class 1 – 4'}
                    onChange={e => setParentFormData({ ...parentFormData, studentClass: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                  >
                    <option value="Nursery / KG">Nursery / KG</option>
                    <option value="Class 1 – 4">Class 1 to 4</option>
                    <option value="Class 5 – 8">Class 5 to 8</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Parent / Guardian Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={parentFormData.parentName || ''}
                    onChange={e => setParentFormData({ ...parentFormData, parentName: e.target.value })}
                    placeholder="Mohammad Farooq"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Parent Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={parentFormData.email || ''}
                    onChange={e => setParentFormData({ ...parentFormData, email: e.target.value })}
                    placeholder="parent@example.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    value={parentFormData.phone || ''}
                    onChange={e => setParentFormData({ ...parentFormData, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={parentFormData.whatsapp || ''}
                    onChange={e => setParentFormData({ ...parentFormData, whatsapp: e.target.value })}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Batch Slot
                  </label>
                  <input
                    type="text"
                    value={parentFormData.batchTiming || ''}
                    onChange={e => setParentFormData({ ...parentFormData, batchTiming: e.target.value })}
                    placeholder="Evening Batch (4:00 PM - 5:30 PM)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={parentFormData.status || 'active'}
                    onChange={e => setParentFormData({ ...parentFormData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                  >
                    <option value="active">Active (Receives bulk notifications)</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Internal Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={parentFormData.notes || ''}
                  onChange={e => setParentFormData({ ...parentFormData, notes: e.target.value })}
                  placeholder="e.g., Needs extra focus in Math multiplication tables."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsParentModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
                >
                  {editingParent ? 'Update Contact' : 'Save Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: BULK IMPORT PARENTS */}
      {/* ========================================================================= */}
      {isBulkImportOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-600" />
                Bulk Import Parent Roster
              </h3>
              <button
                onClick={() => setIsBulkImportOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                Paste comma-separated (CSV) lines or a JSON array below. One student per line:
              </p>

              <div className="bg-slate-100 p-3 rounded-lg text-slate-700 font-mono text-[11px] border border-slate-200">
                <span className="font-bold text-slate-900">Format:</span> Parent Name, Student Name, Class, Email, Phone
                <div className="text-emerald-700 mt-1">
                  Arif Khan, Daniyal Khan, Class 4, arif.khan@example.com, 9876500112<br />
                  Zubair Ahmed, Maryam Ahmed, Class 6, zubair.a@example.com, 9876500113
                </div>
              </div>

              <textarea
                rows={7}
                value={bulkImportText}
                onChange={e => setBulkImportText(e.target.value)}
                placeholder="Parent Name, Student Name, Class, Email, Phone..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />

              {bulkImportError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs font-medium">
                  {bulkImportError}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsBulkImportOpen(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkImport}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                Import Contacts Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT TEMPLATE */}
      {/* ========================================================================= */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                {editingTemplate ? 'Edit Notification Template' : 'Create Notification Template'}
              </h3>
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTemplate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Template Name *
                </label>
                <input
                  type="text"
                  required
                  value={templateFormData.name || ''}
                  onChange={e => setTemplateFormData({ ...templateFormData, name: e.target.value })}
                  placeholder="e.g., Weekly Math Test Reminder"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Category *
                </label>
                <select
                  value={templateFormData.category || 'General Announcement'}
                  onChange={e => setTemplateFormData({ ...templateFormData, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                >
                  <option value="Holiday">Holiday Announcement</option>
                  <option value="Test Schedule">Test Schedule</option>
                  <option value="Progress Update">Progress Update</option>
                  <option value="Fee Notice">Fee Notice</option>
                  <option value="General Announcement">General Announcement</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Subject Line *
                </label>
                <input
                  type="text"
                  required
                  value={templateFormData.subject || ''}
                  onChange={e => setTemplateFormData({ ...templateFormData, subject: e.target.value })}
                  placeholder="Important Notice: ..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Message Body (Supports merge tags like {'{{parent_name}}'}, {'{{student_name}}'}) *
                </label>
                <textarea
                  rows={6}
                  required
                  value={templateFormData.body || ''}
                  onChange={e => setTemplateFormData({ ...templateFormData, body: e.target.value })}
                  placeholder="Dear {{parent_name}},&#10;&#10;..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTemplateModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
                >
                  {editingTemplate ? 'Update Template' : 'Save Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: VIEW LOG DETAILS */}
      {/* ========================================================================= */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full mr-2">
                  {selectedLog.category}
                </span>
                <span className="text-xs text-slate-500">
                  Sent on {new Date(selectedLog.sentAt).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs overflow-y-auto pr-1 flex-1">
              <div>
                <h4 className="font-bold text-base text-slate-900">{selectedLog.subject}</h4>
                <div className="text-slate-500 text-xs mt-0.5">{selectedLog.smtpSummary}</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800 whitespace-pre-line leading-relaxed font-sans">
                {selectedLog.messageBody}
              </div>

              <div>
                <h5 className="font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Recipient Roster ({selectedLog.recipientCount})
                </h5>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {selectedLog.recipients.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900">{r.studentName}</span>
                        <span className="text-slate-500 ml-1">({r.parentName})</span>
                        <span className="text-slate-400 font-mono ml-2 text-[11px]">{r.email}</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.status === 'sent'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.status === 'simulated'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {r.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: FULLSCREEN LIVE EMAIL PREVIEW */}
      {/* ========================================================================= */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-100 rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-300 space-y-4 max-h-[95vh] flex flex-col animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-600" />
                HTML Email Responsive Preview (Recipient: Parent of Zayd Farooq)
              </h3>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="text-slate-500 hover:text-slate-900 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Email Canvas */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex-1 overflow-y-auto">
              {/* Header */}
              <div className="bg-slate-900 p-6 text-center border-b-4 border-emerald-600">
                <div className="inline-block bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                  Official Parent Notice
                </div>
                <h2 className="text-xl font-black text-white">{settings.instituteName}</h2>
                <p className="text-slate-400 text-xs mt-1">Nursery to Class 8 • Foundation Learning Support</p>
              </div>

              {/* Sub-header pill */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                    {composerCategory}
                  </span>
                  <span className="text-slate-700 font-semibold">
                    Student: <strong>Zayd Farooq</strong> (Class 4)
                  </span>
                </div>
                <span className="text-slate-500 font-medium">
                  {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 text-left space-y-4">
                <h3 className="text-lg font-bold text-slate-900">
                  {composerSubject || 'Notice Subject Line'}
                </h3>

                <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                  {getRenderedPreview()}
                </div>

                {/* Faculty Contact Callout */}
                <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 text-xs space-y-1">
                  <div className="font-bold text-emerald-900">Need clarification or wish to speak with faculty?</div>
                  <div>
                    📞 Call: <strong>{settings.phone}</strong> &nbsp;|&nbsp; 💬 WhatsApp: <strong>{settings.whatsapp}</strong>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-slate-50 p-4 text-center border-t border-slate-200 text-xs text-slate-500 space-y-1">
                <div className="font-bold text-slate-800">{settings.instituteName}</div>
                <div>{settings.address}</div>
                <div className="text-[11px] text-slate-400">
                  This official message was dispatched to Mohammad Farooq regarding Zayd Farooq.
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                All merge tags like <code className="font-mono text-emerald-700">{'{{student_name}}'}</code> are automatically replaced with each parent's real information upon dispatch.
              </span>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
