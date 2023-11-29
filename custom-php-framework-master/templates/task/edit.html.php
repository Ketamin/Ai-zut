<?php

/** @var \App\Model\Task $task */
/** @var \App\Service\Router $router */

$title = "Edit Task {$task->getSubject()} ({$task->getId()})";
$bodyClass = "edit";

ob_start(); ?>
    <h1><?= $title ?></h1>
    <form action="<?= $router->generatePath('task-edit') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="task-edit">
        <input type="hidden" name="id" value="<?= $task->getId() ?>">
    </form>

    <ul class="action-list">
        <li>
            <a href="<?= $router->generatePath('task-index') ?>">Back to list</a></li>
        <li>
            <form action="<?= $router->generatePath('task-delete') ?>" method="post">
                <input type="submit" value="Delete" onclick="return confirm('Are you sure?')">
                <input type="hidden" name="action" value="task-delete">
                <input type="hidden" name="id" value="<?= $task->getId() ?>">
            </form>
        </li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
