package app

type User struct {
	Id       int64  `json:"id"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Nickname string `json:"nickname"`
}

type Skill struct {
	Id        int64  `json:"id"`
	SkillName string `json:"skill_name"`
}

type Profession struct {
	Id             int64  `json:"id"`
	ProfessionName string `json:"profession_name"`
}

type SkillDependency struct {
	SkillId          int64 `json:"skill"`
	DependingSkillId int64 `json:"depending_skill"`
}

type ProfessionSkill struct {
	SkillId      int64 `json:"skill"`
	ProfessionId int64 `json:"profession"`
}

type UserSkillProgress struct {
	UserId  int64  `json:"user"`
	SkillId int64  `json:"skill"`
	Status  string `json:"status"`
}

type GraphNode struct {
	SkillId            int64   `json:"skill_id"`
	SkillName          string  `json:"skill_name"`
	AiResponceForSkill string  `json:"ai_responce_for_skill"`
	Status             string  `json:"status"`
	SkillDependens     []int64 `json:"skill_dependens"`
}
