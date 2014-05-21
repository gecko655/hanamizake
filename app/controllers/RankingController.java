package controllers;

import play.mvc.*;
import models.*;

import java.util.*;

public class RankingController extends Application{

	
	@Before
	static void _session_auth(){
        session_auth();
    }
	
	public static void index(){
		List<Category> categories = Category.all().fetch();
		render(categories);
	}
	
	public static void show(Long category_id){
		Category category = Category.find("id = ?", category_id).first();
		if( category == null )
			index();
		
		List<History> histories = History.find("category_id = ?  order by score desc", category.id).fetch();
		render(category, histories);
	}
	
	public static void total_score(){
		List<UserData> users = UserData.find("order by TotalScore desc").fetch(); 
		render(users);
	}
}
