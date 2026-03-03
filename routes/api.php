<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SchoolController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\GuardianController;
use App\Http\Controllers\Api\StaffController;
use App\Http\Controllers\Api\ClassController;
use App\Http\Controllers\Api\SectionController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\AcademicTermController;
use App\Http\Controllers\Api\AcademicYearController;
use App\Http\Controllers\Api\ExamController;
use App\Http\Controllers\Api\ExamScheduleController;
use App\Http\Controllers\Api\ExamResultController;
use App\Http\Controllers\Api\AssignmentController;
use App\Http\Controllers\Api\AssignmentSubmissionController;
use App\Http\Controllers\Api\LessonPlanController;
use App\Http\Controllers\Api\StudentAttendanceController;
use App\Http\Controllers\Api\TimetableController;
use App\Http\Controllers\Api\FeeStructureController;
use App\Http\Controllers\Api\StudentInvoiceController;
use App\Http\Controllers\Api\FeePaymentController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\SupportTicketController;
use App\Http\Controllers\Api\AuditLogController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\ExamCategoryController;
use App\Http\Controllers\Api\FeeCategoryController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\GradeScaleController;
use App\Http\Controllers\Api\GradeScaleEntryController;
use App\Http\Controllers\Api\SystemSettingController;
use App\Http\Controllers\Api\SchoolSettingController;
use App\Http\Controllers\Api\SubscriptionPlanController;
use App\Http\Controllers\Api\SchoolSubscriptionController;
use App\Http\Controllers\Api\PlatformInvoiceController;
use App\Http\Controllers\Api\SchoolModuleController;
use App\Http\Controllers\Api\UserRoleController;
use App\Http\Controllers\Api\PlatformUserController;
use App\Http\Controllers\Api\ClassSubjectController;
use App\Http\Controllers\Api\TeacherSubjectController;
use App\Http\Controllers\Api\TeacherSectionController;
use App\Http\Controllers\Api\StudentParentController;
use App\Http\Controllers\Api\StudentAcademicHistoryController;
use App\Http\Controllers\Api\StudentScholarshipController;
use App\Http\Controllers\Api\SubjectAttendanceController;
use App\Http\Controllers\Api\EmployeeAttendanceController;
use App\Http\Controllers\Api\LeaveRequestController;
use App\Http\Controllers\Api\TimeSlotController;
use App\Http\Controllers\Api\ReportCardController;
use App\Http\Controllers\Api\ReportCardSubjectController;
use App\Http\Controllers\Api\AnnouncementReadController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\MessageRecipientController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\TicketCommentController;
use App\Http\Controllers\Api\ScholarshipController;
use App\Http\Controllers\Api\StudentInvoiceItemController;
use App\Http\Controllers\Api\SchoolTypeController;

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
    Route::apiResource('lesson-plans', LessonPlanController::class);
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
    Route::apiResource('payments', FeePaymentController::class);
    Route::get('students/{id}/invoices', [StudentInvoiceController::class, 'studentInvoices']);
    Route::get('students/{id}/balance', [StudentInvoiceController::class, 'balance']);
    
    // Communications
    Route::apiResource('announcements', AnnouncementController::class);
    // Remplace la ligne apiResource par celle-ci pour correspondre à ton test
Route::post('announcement-reads', [AnnouncementReadController::class, 'markAsRead']);
    Route::apiResource('messages', MessageController::class);
    Route::apiResource('message-recipients', MessageRecipientController::class);
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
    Route::apiResource('user-roles', UserRoleController::class);
    Route::apiResource('platform-users', PlatformUserController::class);
    Route::get('users/{id}/roles', [UserRoleController::class, 'getUserRoles']);
    
    // Relations et associations
    Route::apiResource('class-subjects', ClassSubjectController::class);
    Route::apiResource('teacher-subjects', TeacherSubjectController::class);
    Route::apiResource('teacher-sections', TeacherSectionController::class);
    Route::apiResource('student-parents', StudentParentController::class);
    Route::apiResource('student-academic-history', StudentAcademicHistoryController::class);
    Route::apiResource('student-scholarships', StudentScholarshipController::class);
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
    
    // Paramètres et configuration
    Route::apiResource('system-settings', SystemSettingController::class)->only(['index', 'show', 'update']);
    Route::apiResource('school-settings', SchoolSettingController::class);
    Route::get('system-settings', [SystemSettingController::class, 'index']);
Route::post('system-settings', [SystemSettingController::class, 'store']); // <--- C'est cette ligne qui manque
Route::get('system-settings/{key}', [SystemSettingController::class, 'show']);
Route::put('system-settings/{key}', [SystemSettingController::class, 'update']);
Route::delete('system-settings/{key}', [SystemSettingController::class, 'destroy']);
    
    // Documents et logs
    Route::apiResource('documents', DocumentController::class);
    Route::apiResource('audit-logs', AuditLogController::class)->only(['index', 'show']);
    
Route::get('audit-logs', [AuditLogController::class, 'index']);
Route::get('audit-logs/{id}', [AuditLogController::class, 'show']);
Route::post('audit-logs', [AuditLogController::class, 'store']); // <--- C'est cette ligne qui te manque !
    
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