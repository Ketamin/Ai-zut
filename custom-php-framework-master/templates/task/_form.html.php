<?php
    /** @var $task ?\App\Model\Task */
?>

<div class="form-group">
    <label for="subject">Subject</label>
    <input type="text" id="subject" name="task[subject]" value="<?= $task ? $task->getSubject() : '' ?>">
</div>

<div class="form-group">
    <label for="description">Description</label>
    <textarea id="description" name="task[description]"><?= $task? $task->getDescription() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
