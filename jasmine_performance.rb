#!/usr/bin/ruby

def command_timer(command, time_regex)
  time_diffs = []
  10.times do
    start = Time.now
    out = `#{command}`
    time_taken = Time.now-start
    execution_time = time_regex.match(out)[1]
    puts "`#{command}` took #{time_taken.round 3} seconds.  Jasmine's time was #{execution_time} seconds."
    time_diffs << time_taken - execution_time.to_f
  end
  puts "Average time for excluding unit tests was #{(time_diffs.inject {|a, b| a+b}.to_f/time_diffs.size).round(3)} seconds."
end

command_timer "grunt jasmine", /\d+ specs in ([0-9\.]+)s./
command_timer "grunt jasmine_nodejs", /Finished in ([0-9\.]+) seconds/
