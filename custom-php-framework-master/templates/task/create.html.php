<?php

/** @var \App\Model\Task $task */
/** @var \App\Service\Router $router */

$title = 'Create Task';
$bodyClass = "edit";

ob_start(); ?>
    <h1>Create Task</h1>
    <form action="<?= $router->generatePath('task-create') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="task-create">
    </form>

    <a href="<?= $router->generatePath('task-index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
