package models;

import play.*;
import play.data.validation.Match;
import play.data.validation.MinSize;
import play.data.validation.MaxSize;
import play.data.validation.Required;
import play.data.validation.Unique;
import play.db.jpa.*;

import javax.persistence.*;
import java.util.*;

@Entity
public class Word extends Model{

	@Unique(message="既に登録されています")
	@Required(message="入力してください")
	@MaxSize(value=30, message="30字以内で入力してください")
	public String name;
	
	@Required(message="入力してください")
	@MaxSize(value=30, message="30字以内で入力してください")
	@Match(value="[a-zA-Z0-9ぁ-んー「」ゔ、。,.!?！？]*", message="使用できない文字が含まれています")
	public String key_type;

	@ManyToOne
	@Required
	public Category category;
	
	@ManyToOne
	public UserData userdata;
}
