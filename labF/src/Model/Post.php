<?php
namespace App\Model;

use App\Service\Config;

class Post
{
    private ?int $id = null;
    private ?string $subject = null;
    private ?string $content = null;
    private ?int $price = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Post
    {
        $this->id = $id;

        return $this;
    }

    public function getSubject(): ?string
    {
        return $this->subject;
    }

    public function setSubject(?string $subject): Post
    {
        $this->subject = $subject;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(?string $content): Post
    {
        $this->content = $content;

        return $this;
    }

    public function getPrice(): ?int
    {
        return $this->price;
    }

    public function setPrice(?int $price): Post
    {
        $this->price = $price;

        return $this;
    }

    public static function fromArray($array): Post
    {
        $post = new self();
        $post->fill($array);

        return $post;
    }

    public function fill($array): Post
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['subject'])) {
            $this->setSubject($array['subject']);
        }
        if (isset($array['content'])) {
            $this->setContent($array['content']);
        }
        if (isset($array['price'])) {
            $this->setPrice($array['price']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM post';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $posts = [];
        $postsArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($postsArray as $postArray) {
            $posts[] = self::fromArray($postArray);
        }

        return $posts;
    }

    public static function find($id): ?Post
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM post WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $postArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $postArray) {
            return null;
        }
        $post = Post::fromArray($postArray);

        return $post;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getId()) {
            $sql = "INSERT INTO post (subject, content, price) VALUES (:subject, :content, :price)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'subject' => $this->getSubject(),
                'content' => $this->getContent(),
                'price' => $this->getPrice()
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE post SET subject = :subject, content = :content, price = :price WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':subject' => $this->getSubject(),
                ':content' => $this->getContent(),
                ':price' => $this->getPrice(),
                ':id' => $this->getId()
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM post WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setSubject(null);
        $this->setContent(null);
        $this->setPrice(null);
    }
}
