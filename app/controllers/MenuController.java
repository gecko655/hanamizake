package controllers;

import play.mvc.*;

import models.*;

public class MenuController extends Application{

	@Before
	static void auth(){
		session_auth();
	}
	
    public static void index(){
        render();
    }
	
    public static void game_select(){
    	render();
    }
}
