package models;

import play.*;
import play.data.validation.Unique;
import play.db.jpa.*;

import javax.persistence.*;

import java.util.*;

@Entity
public class Category extends Model{

	@Unique
	public String name;

	@OneToMany(mappedBy="category",cascade=CascadeType.ALL)
	public List<Word> words = new ArrayList<Word>();
    
}
