<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\{
    SchoolController, UserController, ProfileController, StudentController, TeacherController,
    GuardianController, StaffController, ClassController, SectionController, SubjectController,
    DepartmentController, AcademicTermController, AcademicYearController, ExamController,
    ExamScheduleController, ExamResultController, AssignmentController, AssignmentSubmissionController,
    LessonPlanController, StudentAttendanceController, TimetableController, FeeStructureController,
    StudentInvoiceController, FeePaymentController, AnnouncementController, SupportTicketController,
    AuditLogController, DocumentController, ExamCategoryController, FeeCategoryController,
    RoomController, GradeScaleController, GradeScaleEntryController, SystemSettingController,
    SchoolSettingController, SubscriptionPlanController, SchoolSubscriptionController,
    PlatformInvoiceController, SchoolModuleController, UserRoleController, PlatformUserController,
    ClassSubjectController, TeacherSubjectController, TeacherSectionController, StudentParentController,
    StudentAcademicHistoryController, StudentScholarshipController, SubjectAttendanceController,
    EmployeeAttendanceController, LeaveRequestController, TimeSlotController, ReportCardController,
    ReportCardSubjectController, AnnouncementReadController, MessageController, 
    MessageRecipientController, NotificationController, TicketCommentController, 
    ScholarshipController, StudentInvoiceItemController, SchoolTypeController
};

// Version 1 de l'API
Route::prefix('v1')->group(function () {
    
    // ==================== ROUTES DE TEST ====================
    Route::get('/test', function() {
        return response()->json([
            'success' => true,
            'message' => 'API EduSphere fonctionne correctement',
            'version' => '1.0.0',
            'timestamp' => now()->toDateTimeString(),
            'endpoints_count' => 54
        ]);
    });

    // ==================== ROUTES PRINCIPALES ====================
    
    // Écoles
    Route::apiResource('schools', SchoolController::class);
    Route::get('schools/{id}/stats', [SchoolController::class, 'stats']);
    Route::get('schools/{id}/students', [SchoolController::class, 'students']);
    Route::get('schools/{id}/teachers', [SchoolController::class, 'teachers']);
    Route::apiResource('school-types', SchoolTypeController::class);
    
    // Utilisateurs et profils
    Route::apiResource('users', UserController::class);
    Route::apiResource('profiles', ProfileController::class);
    Route::get('users/{id}/roles', [UserController::class, 'roles']);
    
    // Personnes
    Route::apiResource('students', StudentController::class);
    Route::get('students/{id}/attendance', [StudentController::class, 'attendance']);
    Route::get('students/{id}/grades', [StudentController::class, 'grades']);
    Route::get('students/{id}/payments', [StudentController::class, 'payments']);
    
    Route::apiResource('teachers', TeacherController::class);
    Route::get('teachers/{id}/classes', [TeacherController::class, 'classes']);
    Route::get('teachers/{id}/subjects', [TeacherController::class, 'subjects']);
    
    Route::apiResource('guardians', GuardianController::class);
    Route::get('guardians/{id}/students', [GuardianController::class, 'students']);
    
    Route::apiResource('staff', StaffController::class);
    
    // Structure académique
    Route::apiResource('classes', ClassController::class);
    Route::get('classes/{id}/sections', [ClassController::class, 'sections']);
    Route::get('classes/{id}/students', [ClassController::class, 'students']);
    Route::get('classes/{id}/subjects', [ClassController::class, 'subjects']);
    
    Route::apiResource('sections', SectionController::class);
    Route::get('sections/{id}/students', [SectionController::class, 'students']);
    Route::get('sections/{id}/timetable', [SectionController::class, 'timetable']);
    
    Route::apiResource('subjects', SubjectController::class);
    Route::apiResource('departments', DepartmentController::class);
    Route::apiResource('academic-years', AcademicYearController::class);
    Route::apiResource('academic-terms', AcademicTermController::class);
    
    // Examens
    Route::apiResource('exams', ExamController::class);
    Route::apiResource('exam-categories', ExamCategoryController::class);
    Route::apiResource('exam-schedules', ExamScheduleController::class);
    Route::apiResource('exam-results', ExamResultController::class);
    Route::get('exam-schedules/{id}/results', [ExamScheduleController::class, 'results']);
    
    // Devoirs et cours
    Route::apiResource('assignments', AssignmentController::class);
    Route::apiResource('assignment-submissions', AssignmentSubmissionController::class);
    // Au lieu de mettre uniquement ->post() ou ->put()
Route::match(['post', 'put'], 'assignment-submissions/{id}/grade', [AssignmentSubmissionController::class, 'grade']);
    Route::apiResource('lesson-plans', LessonPlanController::class);
    Route::post('lesson-plans/{id}/approve', [LessonPlanController::class, 'approve']);
    Route::get('assignments/{id}/submissions', [AssignmentController::class, 'submissions']);
    
    // Présences
    Route::apiResource('attendance', StudentAttendanceController::class);
    Route::apiResource('subject-attendance', SubjectAttendanceController::class);
    Route::apiResource('employee-attendance', EmployeeAttendanceController::class);
    Route::apiResource('leave-requests', LeaveRequestController::class);
    Route::apiResource('timetable', TimetableController::class);
    Route::apiResource('time-slots', TimeSlotController::class);
    Route::get('attendance/daily/{date}', [StudentAttendanceController::class, 'daily']);
    
    // Finances
    Route::apiResource('fee-structures', FeeStructureController::class);
    Route::apiResource('fee-categories', FeeCategoryController::class);
    Route::apiResource('invoices', StudentInvoiceController::class);
    Route::apiResource('invoice-items', StudentInvoiceItemController::class);
    Route::apiResource('fee-payments', FeePaymentController::class);
    Route::get('students/{id}/invoices', [StudentInvoiceController::class, 'studentInvoices']);
    Route::get('students/{id}/balance', [StudentInvoiceController::class, 'balance']);
    
    // Communications
    Route::apiResource('announcements', AnnouncementController::class);
    Route::apiResource('announcement-reads', AnnouncementReadController::class);
    Route::post('announcement-reads/mark-as-read', [AnnouncementReadController::class, 'markAsRead']);
    
    Route::apiResource('messages', MessageController::class);
    Route::apiResource('message-recipients', MessageRecipientController::class);
    Route::post('message-recipients/{id}/mark-as-read', [MessageRecipientController::class, 'markAsRead']);
    
    Route::apiResource('notifications', NotificationController::class);
    Route::get('users/{id}/notifications', [NotificationController::class, 'userNotifications']);
    Route::post('notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    
    // Support
    Route::apiResource('support-tickets', SupportTicketController::class);
    Route::apiResource('ticket-comments', TicketCommentController::class);
    Route::get('support-tickets/{id}/comments', [SupportTicketController::class, 'comments']);
    
    // Abonnements et modules
    Route::apiResource('subscription-plans', SubscriptionPlanController::class);
    Route::apiResource('school-subscriptions', SchoolSubscriptionController::class);
    Route::apiResource('platform-invoices', PlatformInvoiceController::class);
    Route::apiResource('school-modules', SchoolModuleController::class);
    Route::get('schools/{id}/subscription', [SchoolSubscriptionController::class, 'current']);
    
    // Rôles et permissions
    Route::get('platform-users/stats', [PlatformUserController::class, 'stats']);
    Route::apiResource('platform-users', PlatformUserController::class);
    Route::get('users/{id}/roles', [UserRoleController::class, 'getUserRoles']);
        
    // Relations et associations
    Route::apiResource('class-subjects', ClassSubjectController::class);
    Route::apiResource('teacher-subjects', TeacherSubjectController::class);
    Route::apiResource('teacher-sections', TeacherSectionController::class);
    Route::apiResource('student-parents', StudentParentController::class);
    Route::apiResource('student-academic-histories', StudentAcademicHistoryController::class);
    Route::apiResource('student-scholarships', StudentScholarshipController::class);
    Route::post('student-scholarships/{id}/revoke', [StudentScholarshipController::class, 'revoke']);
    Route::post('class-subjects/bulk', [ClassSubjectController::class, 'bulkAssign']);
    
    // Échelles de notation
    Route::apiResource('grade-scales', GradeScaleController::class);
    Route::apiResource('grade-scale-entries', GradeScaleEntryController::class);
    Route::apiResource('report-cards', ReportCardController::class);
    Route::apiResource('report-card-subjects', ReportCardSubjectController::class);
    Route::get('students/{id}/report-cards', [ReportCardController::class, 'studentReportCards']);
    
    // Bourses
    Route::apiResource('scholarships', ScholarshipController::class);
    
    // Salles
    Route::apiResource('rooms', RoomController::class);
    
    // Paramètres Système
    Route::get('system-settings/public', [SystemSettingController::class, 'public']);
    Route::get('system-settings/export', [SystemSettingController::class, 'export']);
    Route::post('system-settings/bulk-update', [SystemSettingController::class, 'bulkUpdate']);
    Route::post('system-settings/bulk-get', [SystemSettingController::class, 'bulkGet']);
    Route::post('system-settings/import', [SystemSettingController::class, 'import']);
    Route::put('system-settings/{key}', [SystemSettingController::class, 'update']);
    Route::apiResource('school-settings', SchoolSettingController::class);
    Route::apiResource('system-settings', SystemSettingController::class)->parameters(['system-settings' => 'key']);
    
    // Documents et logs
    Route::apiResource('documents', DocumentController::class);
    Route::apiResource('audit-logs', AuditLogController::class);
    
    // ==================== STATISTIQUES GLOBALES ====================
    Route::get('/stats', function() {
        return response()->json([
            'success' => true,
            'data' => [
                'total_schools' => \App\Models\School::count(),
                'total_students' => \App\Models\Student::count(),
                'total_teachers' => \App\Models\Teacher::count(),
                'total_users' => \App\Models\User::count(),
            ]
        ]);
    });
});