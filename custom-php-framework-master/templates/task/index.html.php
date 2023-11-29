<?php

/** @var \App\Model\Task[] $tasks */
/** @var \App\Service\Router $router */

$title = 'Task List';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Tasks List</h1>

    <a href="<?= $router->generatePath('task-create') ?>">Create new</a>

    <ul class="index-list">
        <?php foreach ($tasks as $task): ?>
            <li><h3><?= $task->getSubject() ?></h3>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('task-show', ['id' => $task->getId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('task-edit', ['id' => $task->getId()]) ?>">Edit</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
