<?php

/** @var \App\Model\Task $task */
/** @var \App\Service\Router $router */

$title = "{$task->getSubject()} ({$task->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $task->getSubject() ?></h1>
    <article>
        <?= $task->getDescription();?>
    </article>

    <ul class="action-list">
        <li> <a href="<?= $router->generatePath('task-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('task-edit', ['id'=> $task->getId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
