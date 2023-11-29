<?php
namespace App\Model;

use App\Service\Config;

class Task
{
    private ?int $id = null;
    private ?string $subject = null;
    private ?string $description= null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Task
    {
        $this->id = $id;

        return $this;
    }

    public function getSubject(): ?string
    {
        return $this->subject;
    }

    public function setSubject(?string $subject): Task
    {
        $this->subject = $subject;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): Task
    {
        $this->description = $description;

        return $this;
    }

    public static function fromArray($array): Task
    {
        $task = new self();
        $task->fill($array);

        return $task;
    }

    public function fill($array): Task
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['subject'])) {
            $this->setSubject($array['subject']);
        }
        if (isset($array['description'])) {
            $this->setDescription($array['description']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM task';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $tasks = [];
        $tasksArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($tasksArray as $taskArray) {
            $tasks[] = self::fromArray($taskArray);
        }

        return $tasks;
    }

    public static function find($id): ?Task
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM task WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $taskArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $taskArray) {
            return null;
        }
        $task = Task::fromArray($taskArray);

        return $task;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getId()) {
            $sql = "INSERT INTO task (subject, description) VALUES (:subject, :description)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'subject' => $this->getSubject(),
                'description' => $this->getDescription(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE task SET subject = :subject, description = :description WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':subject' => $this->getSubject(),
                ':description' => $this->getDescription(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM task WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setSubject(null);
        $this->setDescription(null);
    }
}
