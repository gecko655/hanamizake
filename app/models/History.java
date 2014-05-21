package models;

import play.*;
import play.db.jpa.*;

import javax.persistence.*;
import java.util.*;

@Entity
public class History extends Model{
	
	@ManyToOne
	public UserData userdata;
	
	@OneToOne
	public Category category;
	
	public Date created_at;
    
    public double time;
    
    public int missCount;
    
    public int score;
	
	public History(UserData User,Long category_id, int score, double time, int missCount){
		Category category = Category.find("byId", category_id).first();
		this.userdata=User;
        this.category=category;
        this.score=score;
        this.time=time;
        this.missCount=missCount;
    }
	
	@PrePersist
	protected void onCreate(){
		this.created_at=new Date();
	}
    
    
}
